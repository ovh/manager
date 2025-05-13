// Piano Analytics override
export {};

declare global {
  interface Window {
    _pac: {
      cookieSecure?: string;
      cookieSameSite?: string;
    };
  }
}
window._pac = window._pac || {};
window._pac.cookieSecure = 'true';
window._pac.cookieSameSite = 'None';
