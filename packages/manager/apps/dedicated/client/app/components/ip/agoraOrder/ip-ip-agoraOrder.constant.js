export const FETCH_PRICE_MAX_TRIES = 5;

export const PRODUCT_TYPES = {
  dedicatedServer: {
    apiTypeName: 'SERVER',
    typeName: 'DEDICATED',
  },
  privateCloud: {
    apiTypeName: 'DEDICATED_CLOUD',
    typeName: 'PRIVATE_CLOUD',
  },
  vps: {
    apiTypeName: 'VPS',
    typeName: 'VPS',
  },
};

export const IP_AGORA = {
  IPv4Failover: {
    typeName: 'IPv4Failover',
    maxQty: 8,
    minQty: 1,
  },
  IPv4Block: {
    typeName: 'IPv4Block',
    maxQty: 1,
    minQty: 1,
  },
};

export const TRACKING_PREFIX = 'dedicated::ip::dashboard::order::';

export const IP_LOCATION_GROUPS = [
  { labels: ['APAC/CANADA', 'CANADA - ASIA'], countries: ['au', 'ca', 'sg'] },
  {
    labels: ['EUROPE'],
    countries: [
      'be',
      'cz',
      'de',
      'es',
      'fi',
      'fr',
      'gb',
      'ie',
      'it',
      'lt',
      'nl',
      'pl',
      'pt',
      'uk',
    ],
  },
  { labels: ['USA'], countries: ['us'] },
];

export const VPS_MAX_QUANTITY = 16;
export const ADDITIONAL_IP = 'Additional IP';
export const BLOCK_ADDITIONAL_IP = 'Block Additional IP';

export const IP_FAILOVER_RIPE_PLANCODE = 'ip-failover-ripe';

export const ALERT_ID = 'ip.agora-order';

export default {
  FETCH_PRICE_MAX_TRIES,
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  VPS_MAX_QUANTITY,
  TRACKING_PREFIX,
  IP_AGORA,
  IP_FAILOVER_RIPE_PLANCODE,
  ALERT_ID,
};
