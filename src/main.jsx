import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.jsx'

// Inject Vercel Analytics (page views + Web Vitals — zero config)
inject()

/* ══════════════════════════════════════════════════════════════════
   VEDATIME GLOBAL DESIGN SYSTEM
   ------------------------------------------------------------------
   A single source-of-truth stylesheet that normalizes typography,
   spacing, card/button shapes, and section rhythm across the whole
   app via CSS custom properties + cascade. We purposely target the
   app shell (html/body + common elements) so existing inline styles
   inherit consistent defaults without us needing to edit 2000+
   inline style objects. Where a local inline style overrides a
   property it is respected — that is standard CSS cascade.
══════════════════════════════════════════════════════════════════ */
const vedatimeGlobalStyle = document.createElement('style')
vedatimeGlobalStyle.id = 'vedatime-global-design-system'
vedatimeGlobalStyle.textContent = `
  :root {
    /* ── Typography scale ───────────────────────────── */
    --vt-font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif;
    --vt-font-size-h1: clamp(22px, 2.1vw, 28px);
    --vt-font-size-h2: clamp(18px, 1.7vw, 22px);
    --vt-font-size-h3: clamp(16px, 1.3vw, 18px);
    --vt-font-size-body: 15px;
    --vt-font-size-small: 12px;

    --vt-weight-h1: 800;
    --vt-weight-h2: 700;
    --vt-weight-h3: 600;
    --vt-weight-body: 500;
    --vt-weight-btn: 700;

    --vt-line-h1: 1.22;
    --vt-line-h2: 1.28;
    --vt-line-h3: 1.32;
    --vt-line-body: 1.62;
    --vt-line-small: 1.5;

    --vt-track-heading: -0.012em;
    --vt-track-body: 0.012em;

    /* ── Spacing rhythm ─────────────────────────────── */
    --vt-space-xs: 4px;
    --vt-space-sm: 8px;
    --vt-space-md: 12px;
    --vt-space-lg: 16px;
    --vt-space-xl: 22px;
    --vt-space-2xl: 32px;
    --vt-section-gap: 20px;

    /* ── Card shape ─────────────────────────────────── */
    --vt-card-radius: 16px;
    --vt-card-radius-lg: 20px;
    --vt-card-padding: 16px;
    --vt-card-padding-lg: 20px;
    --vt-card-shadow: 0 8px 22px rgba(0,0,0,0.18);
    --vt-card-border: 1px solid rgba(255,255,255,0.08);

    /* ── Button shape ───────────────────────────────── */
    --vt-btn-height: 40px;
    --vt-btn-height-sm: 32px;
    --vt-btn-radius: 12px;
    --vt-btn-pad-x: 16px;
    --vt-btn-pad-x-sm: 12px;

    /* ── Misc ───────────────────────────────────────── */
    --vt-focus-ring: 2px solid #FFC040;
    --vt-divider: rgba(255,255,255,0.10);
  }

  /* Light / warm themes get softer divider alpha */
  html[data-theme="light"], html[data-theme="warm"] {
    --vt-card-shadow: 0 8px 22px rgba(0,0,0,0.08);
    --vt-card-border: 1px solid rgba(0,0,0,0.08);
    --vt-divider: rgba(0,0,0,0.08);
  }

  /* ── Global reset layer (non-destructive) ─────────── */
  *, *::before, *::after { box-sizing: border-box; }
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
    background: #0B0B1F;
  }
  body {
    margin: 0;
    font-family: var(--vt-font-family);
    font-size: var(--vt-font-size-body);
    font-weight: var(--vt-weight-body);
    line-height: var(--vt-line-body);
    letter-spacing: var(--vt-track-body);
    color: #F7F4FF;
    background: radial-gradient(circle at top, #17173A 0%, #0B0B1F 38%, #090916 100%);
  }
  #root { min-height: 100vh; }

  /* ── Typography hierarchy ─────────────────────────── */
  h1, .vt-h1 {
    font-size: var(--vt-font-size-h1);
    font-weight: var(--vt-weight-h1);
    line-height: var(--vt-line-h1);
    letter-spacing: var(--vt-track-heading);
    margin: 0 0 var(--vt-space-md);
  }
  h2, .vt-h2 {
    font-size: var(--vt-font-size-h2);
    font-weight: var(--vt-weight-h2);
    line-height: var(--vt-line-h2);
    letter-spacing: var(--vt-track-heading);
    margin: 0 0 var(--vt-space-sm);
  }
  h3, .vt-h3 {
    font-size: var(--vt-font-size-h3);
    font-weight: var(--vt-weight-h3);
    line-height: var(--vt-line-h3);
    letter-spacing: var(--vt-track-heading);
    margin: 0 0 var(--vt-space-sm);
  }
  h4, h5, h6 {
    font-weight: 600;
    line-height: 1.35;
    margin: 0 0 var(--vt-space-xs);
  }
  p, li {
    font-size: var(--vt-font-size-body);
    line-height: var(--vt-line-body);
  }
  small, .vt-small {
    font-size: var(--vt-font-size-small);
    line-height: var(--vt-line-small);
  }
  strong, b { font-weight: 700; }

  /* ── Minimum readable size guard ─────────────────── */
  span, p, div, button, label, input, textarea, select {
    font-size: max(12px, inherit);
  }

  /* ── Form elements inherit typography ─────────────── */
  button, input, textarea, select {
    font-family: inherit;
    letter-spacing: inherit;
  }
  input, textarea, select {
    font-size: max(14px, inherit);
  }
  textarea { line-height: 1.55; }

  /* ── Button baseline (respects inline overrides) ──── */
  button, [role="button"] {
    -webkit-tap-highlight-color: transparent;
    font-weight: var(--vt-weight-btn);
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, opacity 120ms ease;
  }
  button:disabled { opacity: 0.55; cursor: not-allowed; }
  button:focus-visible, a:focus-visible, [role="button"]:focus-visible {
    outline: var(--vt-focus-ring);
    outline-offset: 2px;
    border-radius: 6px;
  }
  button:hover:not(:disabled) { filter: brightness(1.06); }
  button:active:not(:disabled) { transform: translateY(1px); }

  /* ── Selection & scrollbar ────────────────────────── */
  ::selection { background: rgba(255,192,64,0.35); color: #fff; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#FF7040,#A78BFA); border-radius: 999px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }

  /* ── Image & link polish ──────────────────────────── */
  img { backface-visibility: hidden; -webkit-backface-visibility: hidden; max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  a:hover { text-decoration: underline; text-underline-offset: 3px; }

  /* ── Device accessibility ─────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* ── Animations used throughout the app ───────────── */
  @keyframes vt-pulse { from{opacity:1; transform:scale(1)} to{opacity:0.6; transform:scale(1.12)} }
  @keyframes vt-fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
  @keyframes vt-slideUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
  @keyframes vt-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  /* Legacy aliases the app's inline styles still reference */
  @keyframes pulse { from{opacity:1; transform:scale(1)} to{opacity:0.6; transform:scale(1.12)} }
  @keyframes fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  /* ══════════════════════════════════════════════════
     Indic-script legibility
     Hindi (देवनागरी) + Sanskrit + Tamil + Telugu need a
     slightly taller line-height and tracking so combined
     glyphs do not clip together.
  ══════════════════════════════════════════════════ */
  html[lang="Hindi"] body,
  html[lang="Sanskrit"] body,
  html[lang="Marathi"] body {
    line-height: 1.7;
    letter-spacing: 0.005em;
    font-feature-settings: "kern" 1, "liga" 1;
  }
  html[lang="Hindi"] h1, html[lang="Sanskrit"] h1, html[lang="Marathi"] h1,
  html[lang="Hindi"] h2, html[lang="Sanskrit"] h2, html[lang="Marathi"] h2,
  html[lang="Hindi"] h3, html[lang="Sanskrit"] h3, html[lang="Marathi"] h3 {
    line-height: 1.35;
    letter-spacing: 0;
  }
  html[lang="Tamil"] body, html[lang="Telugu"] body, html[lang="Kannada"] body, html[lang="Bengali"] body, html[lang="Gujarati"] body, html[lang="Punjabi"] body, html[lang="Odia"] body, html[lang="Malayalam"] body {
    line-height: 1.72;
    letter-spacing: 0;
  }
  html[lang="Tamil"] h1, html[lang="Telugu"] h1, html[lang="Kannada"] h1, html[lang="Bengali"] h1, html[lang="Gujarati"] h1, html[lang="Punjabi"] h1, html[lang="Odia"] h1, html[lang="Malayalam"] h1,
  html[lang="Tamil"] h2, html[lang="Telugu"] h2, html[lang="Kannada"] h2, html[lang="Bengali"] h2, html[lang="Gujarati"] h2, html[lang="Punjabi"] h2, html[lang="Odia"] h2, html[lang="Malayalam"] h2,
  html[lang="Tamil"] h3, html[lang="Telugu"] h3, html[lang="Kannada"] h3, html[lang="Bengali"] h3, html[lang="Gujarati"] h3, html[lang="Punjabi"] h3, html[lang="Odia"] h3, html[lang="Malayalam"] h3 {
    line-height: 1.4;
    letter-spacing: 0;
  }

  /* ══════════════════════════════════════════════════
     Density switch — comfortable (default) / compact
  ══════════════════════════════════════════════════ */
  html[data-density="compact"] body { font-size: 14px; line-height: 1.55; }
  html[data-density="compact"] :root { --vt-card-padding: 13px; --vt-card-padding-lg: 16px; }
  html[data-density="spacious"] body { font-size: 16px; line-height: 1.72; }
`
document.head.appendChild(vedatimeGlobalStyle)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
