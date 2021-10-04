import { DEFAULT_SSO_AUTH_URL } from './constants';

const { loginUrl, logoutUrl, euLoginUrl, euLogoutUrl } = DEFAULT_SSO_AUTH_URL;

const buildRedirectUrl = (url, params) => {
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${params.join('&')}`;
};

const redirectTo = (url) => {
  return window.location.assign(url);
};

const isOvhTelecom = () => window.location.host === 'www.ovhtelecom.fr';

export const redirectToLoginPage = (onsuccessUrl) => {
  const params = [];

  if (loginUrl.indexOf('onsuccess') === -1) {
    params.push(
      `onsuccess=${encodeURIComponent(onsuccessUrl || window.location.href)}`,
    );
  }

  // redirect to login url
  redirectTo(buildRedirectUrl(isOvhTelecom() ? euLoginUrl : loginUrl, params));
};

export const redirectToLogoutPage = (onsuccessUrl) => {
  const params = [];

  if (logoutUrl.indexOf('onsuccess') === -1) {
    params.push(
      `onsuccess=${encodeURIComponent(onsuccessUrl || window.location.href)}`,
    );
  }

  if (logoutUrl.indexOf('from') === -1 && document.referrer) {
    params.push(`from=${encodeURIComponent(document.referrer)}`);
  }

  // redirect to login url
  redirectTo(
    buildRedirectUrl(isOvhTelecom() ? euLogoutUrl : logoutUrl, params),
  );
};

export default {
  redirectToLoginPage,
  redirectToLogoutPage,
};
