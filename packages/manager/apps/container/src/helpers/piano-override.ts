// Piano Analytics override
export {};

declare global {
  interface Window {
    _pac: {
      cookieSecure?: string;
      cookieSameSite?: string;
      privacyDefaultMode?: string;
    };
  }
}
window._pac = window._pac || {};
window._pac.cookieSecure = 'true';
window._pac.cookieSameSite = 'None';
// Without a stored `pa_privacy`, the SDK falls back to its default privacy
// mode at load time and persists it — `optin` out of the box, i.e. a consent
// cookie written before any choice. `no-storage` writes nothing: the mode is
// only stored once the user consents (see OvhAtInternet.onUserConsentFromModal).
window._pac.privacyDefaultMode = 'no-storage';
