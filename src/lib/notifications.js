import { getToken, deleteToken, onMessage, isSupported } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, getVedatimeMessaging } from "./firebase";

/*
  Vedatime reminder setup
  - Saves the FCM token immediately after getToken succeeds.
  - Firestore save is useful, but token creation should still count as success even if Firestore has a rules/network issue.
  - VAPID public key fallback is safe because this is a public browser key, not a private key.
*/
const VAPID_KEY =
  ((typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_FIREBASE_VAPID_KEY) || "").trim() ||
  "BEFWUQhoEKJxiJfpHcSwSsiVUm2TwZHojv7ZOapLzkV3QCixPiBnU-w7JVW50LXa_fjh19xujyifeszkYep-0w4";

console.info("[Vedatime reminders] VAPID key loaded:", VAPID_KEY ? `${VAPID_KEY.slice(0, 10)}…${VAPID_KEY.slice(-6)}` : "missing");

function saveTokenEverywhere(token) {
  try {
    localStorage.setItem("vedatime_fcm_token", token);
    localStorage.setItem("vedatime_push_token", token);
    localStorage.setItem("fcm_token", token);
    localStorage.setItem("vedatime_last_fcm_token", token);
    localStorage.setItem("vedatime_push_enabled", "true");
    localStorage.setItem("vedatime_push_token_saved", "true");
    localStorage.setItem("vedatime_reminders", "true");
  } catch (_) {}
}

function clearTokenEverywhere() {
  try {
    localStorage.removeItem("vedatime_fcm_token");
    localStorage.removeItem("vedatime_push_token");
    localStorage.removeItem("fcm_token");
    localStorage.removeItem("vedatime_last_fcm_token");
    localStorage.setItem("vedatime_push_enabled", "false");
    localStorage.setItem("vedatime_push_token_saved", "false");
    localStorage.setItem("vedatime_reminders", "false");
  } catch (_) {}
}

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
    const existing = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js").catch(() => null);
    const registration =
      existing || (await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" }));

    await navigator.serviceWorker.ready;
    return { ok: true, registration };
  } catch (error) {
    console.error("[Vedatime reminders] Service worker registration failed:", error);
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
  if (!VAPID_KEY) return { ok: false, reason: "missing-vapid-key" };

  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) return { ok: false, reason: "firebase-messaging-unsupported" };
  } catch (_) {}

  const permission =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

  console.info("[Vedatime reminders] Notification permission:", permission);
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

  if (!token) {
    console.warn("[Vedatime reminders] FCM returned an empty token.");
    return { ok: false, reason: "no-token" };
  }

  saveTokenEverywhere(token);
  console.info("[Vedatime reminders] FCM token saved:", token);

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
      "muhurat",
      "amavasya",
      "chaturthi",
      "shashthi",
      "navami",
    ],
    source: options.source || "vedatime-web",
  };

  let firestoreSaved = false;
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
    firestoreSaved = true;
  } catch (error) {
    console.warn("[Vedatime reminders] Token saved locally, but Firestore save failed:", error?.message || error);
  }

  try {
    onMessage(messaging, (payload) => {
      const title = payload?.notification?.title || payload?.data?.title || "Vedatime Reminder";
      const body =
        payload?.notification?.body || payload?.data?.body || "You have an important observance today.";
      showLocalConfirmation(title, body);
    });
  } catch (_) {}

  return { ok: true, token, registration: sw.registration, firestoreSaved };
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
    ).catch(() => {});
    clearTokenEverywhere();
    return { ok: true };
  } catch (error) {
    clearTokenEverywhere();
    console.warn("[Vedatime reminders] Disable failed:", error?.message || error);
    return { ok: false, error };
  }
}
