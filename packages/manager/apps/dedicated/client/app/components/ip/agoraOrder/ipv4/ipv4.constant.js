import {
  TRACKING_PREFIX,
  DASHBOARD,
  ALERT_ID,
  ADDITIONAL_IP,
  IP_FAILOVER_PLANCODE,
} from '../ip-ip-agoraOrder.constant';

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
    maxQty: 64,
    minQty: 1,
  },
  IPv4Block: {
    typeName: 'IPv4Block',
    maxQty: 1,
    minQty: 1,
  },
};

export const IP_LOCATION_GROUPS = [
  {
    labels: ['APAC/CANADA', 'CANADA - ASIA'],
    countries: ['au', 'ca', 'sg', 'in'],
  },
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
export const BLOCK_ADDITIONAL_IP = 'Block Additional IP';

export {
  TRACKING_PREFIX,
  ADDITIONAL_IP,
  ALERT_ID,
  IP_FAILOVER_PLANCODE,
  DASHBOARD,
};

export default {
  FETCH_PRICE_MAX_TRIES,
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  IP_FAILOVER_PLANCODE,
  DASHBOARD,
  BLOCK_ADDITIONAL_IP,
  ALERT_ID,
};
