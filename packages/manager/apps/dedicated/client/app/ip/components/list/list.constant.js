export const IP_TYPE = {
  V4: 'IPV4',
  V6: 'IPV6',
};
export const TRACKING_PREFIX = 'dedicated::ip::dashboard';

export const BADGE_FO = 'FO';
export const BADGE_BYOIP = 'BYOIP';
export const BADGES = [BADGE_FO, BADGE_BYOIP];
export const ADDITIONAL_IP = 'Additional IP';
export const LEARN_ORGANIZATION_LINK = 'https://docs.ovh.com/';

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

export const SECURITY_URL = {
  DEFAULT:
    'https://www.ovhcloud.com/en/security/anti-ddos/ddos-attack-mitigation/',
  FR: 'https://www.ovhcloud.com/fr/security/anti-ddos/ddos-attack-mitigation/',
  DE: 'https://www.ovhcloud.com/de/security/anti-ddos/ddos-attack-mitigation/',
  ES:
    'https://www.ovhcloud.com/es-es/security/anti-ddos/ddos-attack-mitigation/',
  IE:
    'https://www.ovhcloud.com/en-ie/security/anti-ddos/ddos-attack-mitigation/',
  IT: 'https://www.ovhcloud.com/it/security/anti-ddos/ddos-attack-mitigation/',
  NL: 'https://www.ovhcloud.com/nl/security/anti-ddos/ddos-attack-mitigation/',
  PL: 'https://www.ovhcloud.com/pl/security/anti-ddos/ddos-attack-mitigation/',
  PT: 'https://www.ovhcloud.com/pt/security/anti-ddos/ddos-attack-mitigation/',
  GB:
    'https://www.ovhcloud.com/en-gb/security/anti-ddos/ddos-attack-mitigation/',
  CA:
    'https://www.ovhcloud.com/en-ca/security/anti-ddos/ddos-attack-mitigation/',
  QC:
    'https://www.ovhcloud.com/fr-ca/security/anti-ddos/ddos-attack-mitigation/',
  US: 'https://us.ovhcloud.com/',
  MA:
    'https://www.ovhcloud.com/fr-ma/security/anti-ddos/ddos-attack-mitigation/',
  SN:
    'https://www.ovhcloud.com/fr-sn/security/anti-ddos/ddos-attack-mitigation/',
  TN:
    'https://www.ovhcloud.com/fr-tn/security/anti-ddos/ddos-attack-mitigation/',
  AU:
    'https://www.ovhcloud.com/en-au/security/anti-ddos/ddos-attack-mitigation/',
  SG:
    'https://www.ovhcloud.com/en-sg/security/anti-ddos/ddos-attack-mitigation/',
  ASIA:
    'https://www.ovhcloud.com/asia/security/anti-ddos/ddos-attack-mitigation/',
  EU: 'https://www.ovhcloud.com/en/security/anti-ddos/ddos-attack-mitigation/',
  WE: 'https://www.ovhcloud.com/en/security/anti-ddos/ddos-attack-mitigation/',
  WS: 'https://www.ovhcloud.com/es/security/anti-ddos/ddos-attack-mitigation/',
};

export default {
  BADGES,
  IP_TYPE,
  TRACKING_PREFIX,
  SERVICE_URL_DATA,
  SECURITY_URL,
  LEARN_ORGANIZATION_LINK,
};
