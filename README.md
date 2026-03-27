# 🕉️ Dharma Calendar AI

> Intelligent Hindu Calendar — Panchang · Festivals · AI Spiritual Guide · Habit Tracker

A cross-platform Progressive Web App (PWA) built with React + Vite. Works on iOS, Android, and Web browsers.

---

## ✨ Features

| Module | Description |
|---|---|
| 📅 Panchang Engine | Tithi, Nakshatra, Yoga, Karana, Sunrise/Sunset, Rahu Kaal, Muhurats |
| 🎉 Festival Calendar | 12+ major Hindu festivals with regional variations & descriptions |
| 🤖 AI Assistant | Vedic knowledge base — travel, fasting, muhurat, remedies, daily guidance |
| 🕉️ Ritual Guide | Step-by-step guided pujas with circular timer (Ganesh, Surya, Lakshmi, Satyanarayan) |
| 📿 Habit Tracker | Streaks, progress rings, daily logging for meditation/chanting/fasting/yoga |
| 👤 Profile | Region/language preferences, notification settings, calendar sync, Premium |

---

## 🚀 Quick Deploy to Vercel + GitHub

### Step 1 — Push to GitHub

```bash
# 1. Initialize git repo
cd dharma-calendar-ai
git init
git add .
git commit -m "feat: initial Dharma Calendar AI MVP"

# 2. Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/dharma-calendar-ai.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy to Vercel

**Option A — Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your `dharma-calendar-ai` GitHub repo
4. Framework preset will auto-detect **Vite**
5. Click **Deploy** — done! 🎉

**Option B — Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

### Step 3 — Install as App (PWA)

**On iPhone/iPad (Safari):**
1. Open your Vercel URL in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add** — Dharma Calendar AI appears as a native app icon!

**On Android (Chrome):**
1. Open the URL in Chrome
2. Tap the **three-dot menu**
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Install**

**On Desktop (Chrome/Edge):**
1. Open the URL
2. Look for the install icon (⊕) in the address bar
3. Click **Install**

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
dharma-calendar-ai/
├── public/
│   ├── favicon.svg          # Om symbol favicon
│   ├── icon-192.png         # PWA icon
│   ├── icon-512.png         # PWA icon (large)
│   └── apple-touch-icon.png # iOS home screen icon
├── src/
│   ├── App.jsx              # Main application (all screens)
│   └── main.jsx             # React entry point
├── index.html               # HTML shell with PWA meta tags
├── vite.config.js           # Vite + PWA plugin config
├── vercel.json              # Vercel SPA routing config
├── package.json
├── .gitignore
└── .env.example             # Environment variables template
```

---

## 🗺️ Roadmap

### v1.1 — Real Panchang API
- [ ] Integrate [Drik Panchang API](https://www.drikpanchang.com/api/) for live calculations
- [ ] Location-based sunrise/sunset using browser Geolocation API
- [ ] Multi-year festival date engine

### v1.2 — Real AI
- [ ] Connect to Anthropic Claude API or OpenAI for natural language Panchang queries
- [ ] Personalized muhurat based on user's birth chart (kundali)

### v1.3 — Backend & Sync
- [ ] Firebase Auth (Google / Apple Sign-In)
- [ ] Firestore for habit streaks sync across devices
- [ ] Google Calendar API + Apple EventKit integration

### v1.4 — Native App
- [ ] Wrap with **Capacitor** for native iOS (.ipa) and Android (.apk)
- [ ] Push notifications for Rahu Kaal alerts and festival reminders
- [ ] Voice-guided ritual mode (Web Speech API)

### v2.0 — Marketplace
- [ ] Puja kits ordering integration
- [ ] Live pandit consultation booking
- [ ] Community events & satsang calendar

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| PWA | vite-plugin-pwa + Workbox |
| Styling | CSS-in-JS (inline styles) |
| Deployment | Vercel |
| Source Control | GitHub |
| Planned: Auth | Firebase / Supabase |
| Planned: AI | Anthropic Claude API |
| Planned: Native | Capacitor (iOS + Android) |

---

## 📜 License

MIT License — Free to use, modify, and deploy.

---

*Sarve Bhavantu Sukhinah — May all beings be happy* 🙏
