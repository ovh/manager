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

export const deleteMatchingCookies = () => {
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.startsWith('_biz_') || cookieName.startsWith('_mkto_trk') || cookieName.startsWith('_gcl_au')) {
      deleteCookie(cookieName);
    }
  });
};
