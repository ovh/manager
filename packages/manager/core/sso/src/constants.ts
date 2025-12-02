export type REGION = 'EU' | 'CA' | 'US';

export const DEFAULT_SSO_AUTH_URL = {
  EU: 'https://www.ovh.com/auth/',
  CA: 'https://ca.ovh.com/auth/',
  US: 'https://us.ovhcloud.com/auth/',
};

export const LOGOUT_ACTION = '?action=disconnect';

export default {
  DEFAULT_SSO_AUTH_URL,
  LOGOUT_ACTION,
};
