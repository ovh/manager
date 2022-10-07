export const IP_TYPE = {
  V4: 'IPV4',
  V6: 'IPV6',
};
export const TRACKING_PREFIX = 'dedicated::ip::dashboard';

export const BADGE_FO = 'FO';
export const BADGE_BYOIP = 'BYOIP';
export const BADGES = [BADGE_FO, BADGE_BYOIP];

export const SERVICE_URL_DATA = {
  CLOUD: {
    universe: 'public-cloud',
    path: '#/pci/projects/:serviceName',
    regEx: /^[a-z0-9]{32}$/,
  },
  VRACK: {
    universe: 'dedicated',
    path: '#/vrack/:serviceName',
    regEx: /^pn/,
  },
  DEDICATED: {
    universe: 'dedicated',
    path: '#/server/:serviceName',
    regEx: /^ns/,
  },
  HOUSING: {
    universe: 'dedicated',
    path: '#/housing/:serviceName',
    regEx: null,
  },
  PRIVATE_CLOUD: {
    universe: 'dedicated',
    path: '#/dedicated_cloud/:serviceName',
    regEx: /^pcc/,
  },
  VPS: {
    universe: 'dedicated',
    path: '#/vps/:serviceName/dashboard',
    regEx: /^vps/,
  },
  IP_LOAD_BALANCING: {
    universe: 'dedicated',
    path: '#/iplb/:serviceName/home',
    regEx: /^loadbalancer/,
  },
};

export default {
  BADGES,
  IP_TYPE,
  TRACKING_PREFIX,
  SERVICE_URL_DATA,
};
