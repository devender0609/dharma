/* Vedatime Firebase Cloud Messaging service worker.
   Put this file in /public/firebase-messaging-sw.js.
   IMPORTANT: Replace the firebaseConfig placeholders with the same real values used by your app. */

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "PASTE_YOUR_REAL_FIREBASE_API_KEY_HERE",
  authDomain: "vedatime-37e37.firebaseapp.com",
  projectId: "vedatime-37e37",
  storageBucket: "vedatime-37e37.appspot.com",
  messagingSenderId: "PASTE_YOUR_REAL_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_REAL_APP_ID_HERE",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || "Vedatime Reminder";
  const body = payload?.notification?.body || payload?.data?.body || "You have an important observance today.";
  const url = payload?.data?.url || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
