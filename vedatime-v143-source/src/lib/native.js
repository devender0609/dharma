/* ══════════════════════════════════════════════════════
   NATIVE (CAPACITOR) HELPER — isolates every platform branch
   so App.jsx stays clean. On plain web this module is a no-op
   — every helper silently falls back to browser equivalents.
══════════════════════════════════════════════════════ */

// All Capacitor imports are resolved lazily so that web bundles never
// execute the native runtime at import time. We import the types/stubs
// statically (they are tiny and web-safe) but gate every call on an
// isNativePlatform() check.
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style as StatusBarStyle } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

/* ---------- Platform detection ---------- */
export function isNativeApp() {
  try {
    return !!(Capacitor && typeof Capacitor.isNativePlatform === "function" && Capacitor.isNativePlatform());
  } catch (_) { return false; }
}

export function nativePlatform() {
  try {
    return (Capacitor && typeof Capacitor.getPlatform === "function") ? Capacitor.getPlatform() : "web";
  } catch (_) { return "web"; }
}

/* ---------- External URL opener ----------
   - http(s): open with Capacitor Browser (SFSafariViewController / Chrome
     Custom Tab) on native; window.open on web.
   - mailto: / tel: / sms:: always delegate to the OS via window.open /
     window.location so the right app handles it.
*/
export function openExternal(url, target = "_blank") {
  const safe = String(url || "");
  if (!safe) return;
  const isHttp = /^https?:\/\//i.test(safe);
  const isMailto = /^mailto:/i.test(safe);
  const isTel = /^tel:/i.test(safe);
  const isSms = /^sms:/i.test(safe);

  try {
    if (isNativeApp() && isHttp) {
      // Prefer in-app browser so the user can return to our app.
      return Browser.open({ url: safe, windowName: "_system" });
    }
    if (isNativeApp() && (isMailto || isTel || isSms)) {
      // Capacitor hands protocol URLs to the OS when assigned to location.
      try { window.location.href = safe; return; } catch (_) {}
    }
    // Web (and fallback): normal window.open
    if (typeof window !== "undefined" && typeof window.open === "function") {
      window.open(safe, target || "_blank", "noopener,noreferrer");
    }
  } catch (_) {
    // Absolute last resort: try plain window.open.
    try { window.open(safe, target || "_blank"); } catch (_) {}
  }
}

/* ---------- One-shot native shell init ----------
   Called once from the top-level App useEffect. On web it's a no-op.
   On native it:
     - sets StatusBar colors
     - hides the splash screen as soon as React has mounted
     - wires the hardware back button (Android) to browser history
     - ensures keyboard pushes the body up rather than covering the input
*/
export async function initNativeShell() {
  if (!isNativeApp()) return;

  // Status bar — match app background so the notch area isn't white.
  try {
    await StatusBar.setStyle({ style: StatusBarStyle.Dark });
  } catch (_) {}
  try {
    if (nativePlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#0A0A18" });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (_) {}

  // Hide the splash screen now that React has rendered the first frame.
  try {
    await SplashScreen.hide();
  } catch (_) {}

  // Android hardware back button — behave like browser back, and if we're
  // at the root of the stack, minimize the app instead of closing it.
  try {
    CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        try { window.history.back(); } catch (_) {}
      } else {
        try { CapApp.minimizeApp(); } catch (_) {}
      }
    });
  } catch (_) {}

  // Keyboard — ensure body scrolls rather than content being hidden.
  try {
    Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {});
  } catch (_) {}
}
