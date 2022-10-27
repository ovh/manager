export const IP_TYPE = {
  V4: 'IPV4',
  V6: 'IPV6',
};
export const BRING_YOUR_OWN_IP = 'Bring your own IP';
export const TRACKING_PREFIX = 'dedicated::ip::dashboard';
export const SERVICE_TYPES = [
  'cloud',
  'dedicated',
  'failover',
  'housing',
  'loadBalancing',
  'pcc',
  'vps',
  'vrack',
  'xdsl',
];

export const IP_FILTERS_CHAPTER_1 = 'all_ips_filter';
export const ADDITIONAL_IP = 'Additional IP';

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
  IP_TYPE,
  BRING_YOUR_OWN_IP,
  SERVICE_TYPES,
  TRACKING_PREFIX,
  IP_FILTERS_CHAPTER_1,
  ADDITIONAL_IP,
  SERVICE_URL_DATA,
};
