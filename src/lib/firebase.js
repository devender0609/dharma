import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) || "AIzaSyCFc7ogpQ6kZUMkyP2XAQFUIom-WBXe8QE",
  authDomain: (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "vedatime-37e37.firebaseapp.com",
  projectId: (import.meta.env && import.meta.env.VITE_FIREBASE_PROJECT_ID) || "vedatime-37e37",
  storageBucket: (import.meta.env && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || "vedatime-37e37.appspot.com",
  messagingSenderId: (import.meta.env && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "377861968808",
  appId: (import.meta.env && import.meta.env.VITE_FIREBASE_APP_ID) || "1:377861968808:web:4382e975212abc62b4039d",
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
