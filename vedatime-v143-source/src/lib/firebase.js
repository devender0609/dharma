import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";

/* ================================
   FIREBASE CONFIG (FROM ENV)
================================ */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ================================
   INIT APP + AUTH
================================ */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ================================
   PERSISTENCE — keep user signed in across refresh / new tabs.
   browserLocalPersistence uses localStorage; if unavailable
   (private mode, partitioned storage, mobile webview) we fall back to
   in-memory persistence so the call never throws at boot.
================================ */
setPersistence(auth, browserLocalPersistence).catch(() => {
  setPersistence(auth, inMemoryPersistence).catch(() => {});
});

/* ================================
   GOOGLE PROVIDER
================================ */
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

/* ================================
   BOOT-TIME ENV CHECK
================================ */
if (!firebaseConfig.apiKey) {
  // eslint-disable-next-line no-console
  console.error("Firebase env variables missing — VITE_FIREBASE_* not set.");
}
