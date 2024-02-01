// Piano Analytics override
export {};

declare global {
    interface Window {
      _pac: any;
    }
  }
window._pac = window._pac || {};
window._pac.cookieSecure = "true";
window._pac.cookieSameSite = "None";