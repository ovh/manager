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
// The SDK resolves its privacy mode in its constructor, i.e. as soon as
// piano-analytics.js is imported: with no pa_privacy cookie it falls back to
// privacyDefaultMode, whose built-in value 'optin' is persisted at once as
// pa_privacy=optin — before any consent. Only values read from window._pac at
// construction time apply here; a later pa.setConfigurations() is too late.
// 'no-storage' forbids every Piano storage key, so nothing is written until
// the tracking plugin switches to 'optin' on consent.
window._pac.privacyDefaultMode = 'no-storage';
