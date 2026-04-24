import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, getVedatimeMessaging } from "./firebase";

const VAPID_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_FIREBASE_VAPID_KEY) || "";

try {
  console.log("[Vedatime reminders] VAPID key loaded:", VAPID_KEY ? `${VAPID_KEY.slice(0, 10)}… (${VAPID_KEY.length} chars)` : "missing");
} catch (_) {}

function getClientId() {
  try {
    let id = localStorage.getItem("vedatime_client_id");
    if (!id) {
      id = `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("vedatime_client_id", id);
    }
    return id;
  } catch (_) {
    return `web_${Date.now()}`;
  }
}

async function registerMessagingServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return { ok: false, reason: "service-worker-unsupported" };
  }

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    return { ok: true, registration };
  } catch (error) {
    console.warn("[Vedatime reminders] Service worker registration failed:", error?.message || error);
    return { ok: false, reason: "service-worker-failed", error };
  }
}

function showLocalConfirmation(title, body) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
    }
  } catch (_) {}
}

export async function enableVedatimePushReminders(options = {}) {
  if (typeof window === "undefined") return { ok: false, reason: "server" };
  if (!("Notification" in window)) return { ok: false, reason: "notifications-unsupported" };
  if (!window.isSecureContext) return { ok: false, reason: "not-secure-context" };
  if (!VAPID_KEY) {
    console.warn("[Vedatime reminders] Missing VITE_FIREBASE_VAPID_KEY.");
    return { ok: false, reason: "missing-vapid-key" };
  }

  const permission =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

  if (permission !== "granted") return { ok: false, reason: "permission-denied" };

  const sw = await registerMessagingServiceWorker();
  if (!sw.ok) return sw;

  const messaging = await getVedatimeMessaging();
  if (!messaging) return { ok: false, reason: "messaging-unsupported" };

  let token = "";
  try {
    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: sw.registration,
    });
  } catch (error) {
    console.error("[Vedatime reminders] FCM getToken failed:", error);
    return { ok: false, reason: "get-token-failed", error };
  }

  if (!token) return { ok: false, reason: "no-token" };

  const uid = auth.currentUser?.uid || getClientId();
  const reminderPrefs = {
    enabled: true,
    location: options.location || "Austin",
    interests: options.interests || [],
    observanceTypes: options.observanceTypes || [
      "ashtami",
      "ekadashi",
      "pradosh",
      "purnima",
      "amavasya",
      "chaturthi",
      "shashthi",
      "navami",
    ],
    source: options.source || "vedatime-web",
  };

  try {
    await setDoc(
      doc(db, "reminderTokens", uid),
      {
        uid,
        email: auth.currentUser?.email || null,
        displayName: auth.currentUser?.displayName || null,
        token,
        platform: "web",
        userAgent: navigator.userAgent,
        reminderPrefs,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("[Vedatime reminders] Token was created, but Firestore save failed:", error?.message || error);
    return { ok: false, reason: "firestore-save-failed", error, token };
  }

  try {
    localStorage.setItem("vedatime_push_enabled", "true");
    localStorage.setItem("vedatime_reminders", "true");
    localStorage.setItem("vedatime_push_token_saved", "true");
    localStorage.setItem("vedatime_last_fcm_token", token);
    localStorage.setItem("vedatime_fcm_token", token);
    localStorage.setItem("vedatime_push_token", token);
    localStorage.setItem("fcm_token", token);
  } catch (_) {}

  try {
    onMessage(messaging, (payload) => {
      const title = payload?.notification?.title || payload?.data?.title || "Vedatime Reminder";
      const body =
        payload?.notification?.body || payload?.data?.body || "You have an important observance today.";
      showLocalConfirmation(title, body);
    });
  } catch (_) {}

  console.info("[Vedatime reminders] FCM token:", token);
  return { ok: true, token, registration: sw.registration };
}

export async function disableVedatimePushReminders() {
  try {
    const messaging = await getVedatimeMessaging();
    if (messaging) await deleteToken(messaging).catch(() => {});
    const uid = auth.currentUser?.uid || getClientId();
    await setDoc(
      doc(db, "reminderTokens", uid),
      {
        enabled: false,
        disabledAt: serverTimestamp(),
        reminderPrefs: { enabled: false },
      },
      { merge: true }
    );
    localStorage.setItem("vedatime_push_enabled", "false");
    localStorage.setItem("vedatime_reminders", "false");
    return { ok: true };
  } catch (error) {
    console.warn("[Vedatime reminders] Disable failed:", error?.message || error);
    return { ok: false, error };
  }
}
