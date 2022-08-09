export const DEFAULT_REQUEST_TYPES = [
  {
    type: 'apiv6',
    urlPrefix: '/engine/apiv6',
  },
  {
    type: 'aapi',
    urlPrefix: '/engine/2api',
  },
  {
    type: 'ws',
    urlPrefix: '/engine/ws',
  },
  {
    type: 'none',
    urlPrefix: '',
  },
];

export const DEFAULT_SSO_AUTH_URL = {
  loginUrl: '/auth/',
  logoutUrl: '/auth/?action=disconnect',
  euLoginUrl: 'https://www.ovh.com/auth/',
  euLogoutUrl: 'https://www.ovh.com/auth/?action=disconnect',
};

export default {
  DEFAULT_REQUEST_TYPES,
  DEFAULT_SSO_AUTH_URL,
};
