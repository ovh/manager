export const deleteCookie = (cookieName: string) => {
  // Delete the cookie by setting its expiration date to the past
  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  // Also try to delete with domain variations
  const domain = window.location.hostname;
  document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  // Try with parent domain
  const domainParts = domain.split('.');
  if (domainParts.length > 2) {
    const parentDomain = domainParts.slice(-2).join('.');
    document.cookie = `${cookieName}=; path=/; domain=.${parentDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

// Deletes a cookie on the current host and every parent domain — needed for
// cookies set on an intermediate domain (e.g. Piano's `.eu.ovhcloud.com`).
export const deleteCookieOnAllDomains = (cookieName: string) => {
  const parts = window.location.hostname.split('.');
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `${cookieName}=; path=/; ${expired}`;
  parts.slice(1, -1).forEach((_, i) => {
    const domain = parts.slice(i + 1).join('.');
    document.cookie = `${cookieName}=; path=/; domain=.${domain}; ${expired}`;
  });
};

export const deleteMatchingCookies = () => {
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.startsWith('_biz_') || cookieName.startsWith('_mkto_trk') || cookieName.startsWith('_gcl_au')) {
      deleteCookie(cookieName);
    }
  });
};
