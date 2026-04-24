/* Vedatime Firebase Cloud Messaging service worker.
   File location: /public/firebase-messaging-sw.js */

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCFc7ogpQ6kZUMkyP2XAQFUIom-WBXe8QE",
  authDomain: "vedatime-37e37.firebaseapp.com",
  projectId: "vedatime-37e37",
  storageBucket: "vedatime-37e37.appspot.com",
  messagingSenderId: "377861968808",
  appId: "1:377861968808:web:4382e975212abc62b4039d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || "Vedatime Reminder";
  const body = payload?.notification?.body || payload?.data?.body || "You have an important observance today.";
  const url = payload?.data?.url || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png",
    data: { url },
    requireInteraction: false,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
