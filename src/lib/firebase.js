import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) || "PASTE_YOUR_REAL_FIREBASE_API_KEY_HERE",
  authDomain: (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "vedatime-37e37.firebaseapp.com",
  projectId: (import.meta.env && import.meta.env.VITE_FIREBASE_PROJECT_ID) || "vedatime-37e37",
  storageBucket: (import.meta.env && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || "vedatime-37e37.appspot.com",
  messagingSenderId: (import.meta.env && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "PASTE_YOUR_REAL_MESSAGING_SENDER_ID_HERE",
  appId: (import.meta.env && import.meta.env.VITE_FIREBASE_APP_ID) || "PASTE_YOUR_REAL_APP_ID_HERE",
};

const app = initializeApp(firebaseConfig);

export { app, firebaseConfig };
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function getVedatimeMessaging() {
  try {
    const supported = await isMessagingSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch (error) {
    console.warn("[Vedatime] Firebase Messaging not supported:", error?.message || error);
    return null;
  }
}

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
