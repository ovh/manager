import { TRACKING_PREFIX, ALERT_ID } from '../ip-ip-agoraOrder.constant';

export const PRODUCT_TYPES = {
  vrack: {
    apiTypeName: 'VRACK',
    typeName: 'VRACK',
  },
};

export const FLAGS = {
  par: 'fr',
  gra: 'fr',
  sbg: 'fr',
  lim: 'de',
  waw: 'pl',
  eri: 'gb',
  vin: 'us',
  hil: 'us',
  bhs: 'ca',
  sgp: 'sg',
  syd: 'au',
  rbx: 'fr',
  tor: 'ca',
  mum: 'in',
  '1-preprod': 'fr',
  '1-dev-2': 'fr',
  '1-dev-1': 'fr',
  bru: 'be',
  mad: 'es',
  dal: 'us',
  lax: 'us',
  chi: 'us',
  nyc: 'us',
  mia: 'us',
  pao: 'us',
  den: 'us',
  atl: 'us',
  mrs: 'fr',
};

export const DEDICATED_IP_ORDER_TRACKING_PREFIX =
  'dedicated::ip::dashboard::order';
export const ACTIONS_SUFFIX = 'action';

export default {
  DEDICATED_IP_ORDER_TRACKING_PREFIX,
  ACTIONS_SUFFIX,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  ALERT_ID,
  FLAGS,
};
