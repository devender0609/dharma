import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Vedatime — Capacitor configuration
 *
 * This file turns the Vite web build into a native-app-ready webview shell
 * for iOS and Android. It does NOT change the web app's behavior — it only
 * wraps the `dist/` output produced by `npm run build`.
 *
 * Change `appId` and `appName` carefully — they are baked into the native
 * bundle identifier and must stay stable across releases once submitted to
 * the App Store / Play Store.
 */
const config: CapacitorConfig = {
  appId: 'com.vedatime.app',
  appName: 'Vedatime',
  webDir: 'dist',
  // keep web runtime outside the bundle — Vite already ships everything needed
  bundledWebRuntime: false,

  /* ================================
     SERVER / NETWORKING
     - https scheme on both platforms so Firebase Auth treats the origin
       consistently (capacitor://localhost and http://localhost cause
       auth/unauthorized-domain issues).
     - No dev `url` here — production builds should load the bundled
       `dist/` files. Point `url` to a LAN dev server only during local
       development if you want live reload.
  ================================ */
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // hostname is what appears in the WebView's origin. Add this hostname
    // to Firebase → Authentication → Settings → Authorized domains so
    // Google sign-in will accept it.
    hostname: 'app.vedatime.com',
    // Allow navigation to known third-party flows that must stay in-app.
    allowNavigation: [
      'accounts.google.com',
      '*.firebaseapp.com',
      '*.google.com',
      '*.stripe.com',
      'checkout.stripe.com',
      'billing.stripe.com',
      'www.youtube.com',
      'youtube.com',
      'youtu.be'
    ]
  },

  /* ================================
     ANDROID
  ================================ */
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },

  /* ================================
     iOS
     - contentInset `always` keeps the WebView below the notch/status bar.
     - `limitsNavigationsToAppBoundDomains` left false so OAuth/Stripe flows
       can navigate freely.
  ================================ */
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
    scheme: 'Vedatime'
  },

  /* ================================
     PLUGINS
  ================================ */
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#0A0A18',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0A18',
      overlaysWebView: false
    },
    Browser: {
      // Default browser styling — honor system theme.
      toolbarColor: '#0A0A18'
    }
  }
};

export default config;
