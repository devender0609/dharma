import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.jsx'

// Inject Vercel Analytics (page views + Web Vitals — zero config)
inject()

const fontSmoothingStyle = document.createElement('style')
fontSmoothingStyle.textContent = `
  html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; scroll-behavior:smooth; background:#0B0B1F; }
  body { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: 0.005em; font-size: 16px; line-height: 1.68; color: #F7F4FF; background: radial-gradient(circle at top, #17173A 0%, #0B0B1F 38%, #090916 100%); -webkit-text-size-adjust: 100%; }
  #root { min-height:100vh; }
  p, li, label, input, textarea, select, button { font-size: 1rem; }
  h1, h2, h3 { letter-spacing: -0.02em; text-rendering: geometricPrecision; }
  h1 { font-size: clamp(1.5rem, 2vw, 2rem); }
  h2 { font-size: clamp(1.24rem, 1.6vw, 1.62rem); }
  h3 { font-size: clamp(1.08rem, 1.2vw, 1.22rem); }
  button, input, textarea, select { font: inherit; }
  * { box-sizing: border-box; }
  button, [role="button"] { -webkit-tap-highlight-color: transparent; }
  ::selection { background: rgba(255,192,64,0.35); color: #fff; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#FF7040,#A78BFA); border-radius: 999px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
`
document.head.appendChild(fontSmoothingStyle)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
