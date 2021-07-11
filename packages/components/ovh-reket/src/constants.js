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
    type: 'apiv7',
    urlPrefix: '/engine/apiv7',
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
};

export default {
  DEFAULT_REQUEST_TYPES,
  DEFAULT_SSO_AUTH_URL,
};
