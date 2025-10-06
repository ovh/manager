import { DEFAULT_SSO_AUTH_URL, LOGOUT_ACTION, REGION } from './constants';

const buildRedirectUrl = (url: string, params: string[]) => {
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${params.join('&')}`;
};

const redirectTo = (url: string) => {
  return window.location.assign(url);
};

const isOvhTelecom = () => window.location.host === 'www.ovhtelecom.fr';

export const getAuthUrl = () => {
  if (window.location.hostname === 'localhost') {
    return '/auth/';
  }
  if (isOvhTelecom()) {
    return DEFAULT_SSO_AUTH_URL.EU;
  }
  const [, region] = window.location.host.split('.');
  return DEFAULT_SSO_AUTH_URL[`${(region || 'eu').toUpperCase() as REGION}`];
};

export const getLogoutUrl = (onsuccessUrl = '') => {
  const params = [];
  const logoutUrl = getAuthUrl();
  if (logoutUrl.indexOf('onsuccess') === -1) {
    params.push(`onsuccess=${encodeURIComponent(onsuccessUrl || window.location.href)}`);
  }

  if (logoutUrl.indexOf('from') === -1 && document.referrer) {
    params.push(`from=${encodeURIComponent(document.referrer)}`);
  }

  return buildRedirectUrl(`${logoutUrl}${LOGOUT_ACTION}`, params);
};

export const redirectToLoginPage = (onsuccessUrl = '') => {
  const params = [];
  const loginUrl = getAuthUrl();
  if (loginUrl.indexOf('onsuccess') === -1) {
    params.push(`onsuccess=${encodeURIComponent(onsuccessUrl || window.location.href)}`);
  }

  // redirect to login url
  redirectTo(buildRedirectUrl(loginUrl, params));
};

export const redirectToLogoutPage = (onsuccessUrl = '') => {
  redirectTo(getLogoutUrl(onsuccessUrl));
};

export * from './constants';

export default {
  DEFAULT_SSO_AUTH_URL,
  redirectToLoginPage,
  redirectToLogoutPage,
};
