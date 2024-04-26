export const IP_TYPE = {
  V4: 'IPV4',
  V6: 'IPV6',
};
export const TRACKING_PREFIX = 'dedicated::ip::dashboard';

export const SUB_RANGE = 'SUBRANGE';
export const BADGE_FO = 'FO';
export const BADGE_BYOIP = 'BYOIP';
export const BADGES = [BADGE_FO, BADGE_BYOIP];
export const ADDITIONAL_IP = 'Additional IP';
export const FILTER_OPTIONS = {
  IPV4_IPS: 4,
  IPV6_IPS: 6,
  ALL_IPS: 'all',
};

export const TRACKING_OPTIONS = {
  IPV4: 'ips_v4',
  IPV6: 'ips_v6',
  ALL_IPS: 'all_ips',
  TRACK_CHAPTER1: 'all_ips_filter',
};
export const VRACK = 'VRACK';
export const PCC = 'PCC';
export const FAILOVER = 'FAILOVER';

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
  IN:
    'https://www.ovhcloud.com/en-in/security/anti-ddos/ddos-attack-mitigation/',
  EU: 'https://www.ovhcloud.com/en/security/anti-ddos/ddos-attack-mitigation/',
  WE: 'https://www.ovhcloud.com/en/security/anti-ddos/ddos-attack-mitigation/',
  WS: 'https://www.ovhcloud.com/es/security/anti-ddos/ddos-attack-mitigation/',
};

export const IP_COMPONENTS_LIST_TRACKING_HIT = {
  ADVANCED_MODE_ON: 'advanced_mode_on',
  ADVANCED_MODE_OFF: 'advanced_mode_off',
  EXPORT: 'export-csv',
  IMPORT: 'import',
  ORGANISATION: 'manage-organisation',
};
export const PAGE_SIZE_MIN = 10;
export const PAGE_SIZE_MAX = 100;

export default {
  BADGES,
  IP_TYPE,
  TRACKING_PREFIX,
  SECURITY_URL,
  IP_COMPONENTS_LIST_TRACKING_HIT,
  PAGE_SIZE_MIN,
  PAGE_SIZE_MAX,
  VRACK,
  PCC,
  FAILOVER,
};
