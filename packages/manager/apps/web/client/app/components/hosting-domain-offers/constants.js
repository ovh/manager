import moment from 'moment';

export const UCENTS_FACTOR = 100000000;

export const NEW_OFFERS_START_DATE = moment('2023-06-15');

export const NEW_OFFERS_END_DATE = moment(NEW_OFFERS_START_DATE).add(6, 'M');

export const CATEGORIES_MAP = {
  'hosting-perso': 'PERSO',
  'hosting-pro': 'PRO',
  'hosting-performance-1': 'PERFORMANCE',
  'hosting-performance-2': 'PERFORMANCE',
  'hosting-performance-3': 'PERFORMANCE',
  'hosting-performance-4': 'PERFORMANCE',
};

export const CLOUDWEB_OFFER = ['cloudweb1', 'cloudweb2', 'cloudweb3'];

export const CLOUDWEB_VERSION_MAP = {
  cloudweb1: 'CLOUDWEB_1',
  cloudweb2: 'CLOUDWEB_2',
  cloudweb3: 'CLOUDWEB_3',
};

export const VERSION_MAP = {
  'hosting-perso': 'PERSO',
  'hosting-pro': 'PRO',
  'hosting-performance-1': 'PERFORMANCE_1',
  'hosting-performance-2': 'PERFORMANCE_2',
  'hosting-performance-3': 'PERFORMANCE_3',
  'hosting-performance-4': 'PERFORMANCE_4',
};

export const BADGES = {
  NEW: 'new',
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
};

export const NEW_OFFERS_PLAN_CODES = {
  PERSO: 'hosting-perso',
  PRO: 'hosting-pro',
  PERFORMANCE_1: 'hosting-performance-1',
  PERFORMANCE_2: 'hosting-performance-2',
  PERFORMANCE_3: 'hosting-performance-3',
  PERFORMANCE_4: 'hosting-performance-4',
};

export const WEB_CLOUD_DB_VALUES = '512MB RAM - 8GB';

export default {
  UCENTS_FACTOR,
  NEW_OFFERS_START_DATE,
  NEW_OFFERS_END_DATE,
  BADGES,
  NEW_OFFERS_PLAN_CODES,
  CATEGORIES_MAP,
  VERSION_MAP,
  CLOUDWEB_OFFER,
  CLOUDWEB_VERSION_MAP,
  WEB_CLOUD_DB_VALUES,
};
