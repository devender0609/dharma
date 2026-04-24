import { getToken, deleteToken } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, getVedatimeMessaging } from "./firebase";

const VAPID_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_FIREBASE_VAPID_KEY) || "";

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

async function getRegistration() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (error) {
    console.warn("[Vedatime reminders] Service worker registration failed:", error?.message || error);
    return null;
  }
}

export async function enableVedatimePushReminders(options = {}) {
  if (typeof window === "undefined") return { ok: false, reason: "server" };
  if (!("Notification" in window)) return { ok: false, reason: "notifications-unsupported" };
  if (!VAPID_KEY) {
    console.warn("[Vedatime reminders] Missing VITE_FIREBASE_VAPID_KEY. Browser push token cannot be created yet.");
    return { ok: false, reason: "missing-vapid-key" };
  }

  const permission = Notification.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();

  if (permission !== "granted") return { ok: false, reason: "permission-denied" };

  const messaging = await getVedatimeMessaging();
  if (!messaging) return { ok: false, reason: "messaging-unsupported" };

  const registration = await getRegistration();
  if (!registration) return { ok: false, reason: "service-worker-failed" };

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) return { ok: false, reason: "no-token" };

  const uid = auth.currentUser?.uid || getClientId();
  const reminderPrefs = {
    enabled: true,
    location: options.location || "Austin",
    interests: options.interests || [],
    observanceTypes: options.observanceTypes || ["ashtami", "ekadashi", "pradosh", "purnima", "amavasya"],
    source: options.source || "vedatime-web",
  };

  await setDoc(doc(db, "reminderTokens", uid), {
    uid,
    email: auth.currentUser?.email || null,
    displayName: auth.currentUser?.displayName || null,
    token,
    platform: "web",
    userAgent: navigator.userAgent,
    reminderPrefs,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  try {
    localStorage.setItem("vedatime_push_enabled", "true");
    localStorage.setItem("vedatime_push_token_saved", "true");
  } catch (_) {}

  return { ok: true, token };
}

export async function disableVedatimePushReminders() {
  try {
    const messaging = await getVedatimeMessaging();
    if (messaging) await deleteToken(messaging).catch(() => {});
    const uid = auth.currentUser?.uid || getClientId();
    await setDoc(doc(db, "reminderTokens", uid), {
      enabled: false,
      disabledAt: serverTimestamp(),
      reminderPrefs: { enabled: false },
    }, { merge: true });
    localStorage.setItem("vedatime_push_enabled", "false");
    return { ok: true };
  } catch (error) {
    console.warn("[Vedatime reminders] Disable failed:", error?.message || error);
    return { ok: false, error };
  }
}
