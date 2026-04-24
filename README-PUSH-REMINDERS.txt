Vedatime push-reminder fix

Replace these files in your project:
- src/App.jsx
- src/lib/firebase.js
- src/lib/notifications.js
- public/firebase-messaging-sw.js

Required Vercel environment variable:
- VITE_FIREBASE_VAPID_KEY

After replacing:
npm run build
git add src/App.jsx src/lib/firebase.js src/lib/notifications.js public/firebase-messaging-sw.js
git commit -m "fix push reminders"
git pull origin main --rebase
git push origin main

Then redeploy on Vercel with Clear Cache.
