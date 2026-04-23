import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_REAL_FIREBASE_API_KEY_HERE",
  authDomain: "vedatime-37e37.firebaseapp.com",
  projectId: "vedatime-37e37",
  storageBucket: "vedatime-37e37.appspot.com",
  messagingSenderId: "PASTE_YOUR_REAL_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_REAL_APP_ID_HERE",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});