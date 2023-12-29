export const PRODUCT_NAME = 'webHosting';

export const DATACENTER_CONFIGURATION_KEY = 'dc';

export const ENGINE_CONFIGURATION_KEY = 'engine';

export const DB_OFFERS = {
  STARTER: {
    PLAN_CODE_PREFIX: 'sql_optional_',
    CATEGORY: 'starter',
    FAMILY: null,
    TRACKING: 'Start_SQL',
    PRODUCT_NAME: 'webHosting',
  },
  PRIVATE: {
    PLAN_CODE_PREFIX: 'private_sql_',
    CATEGORY: 'private',
    FAMILY: 'cloud-db',
    TRACKING: 'Web_Cloud_database',
    PRODUCT_NAME: 'cloudDB',
  },
};

export const OFFERS_WITHOUT_START_SQL = [
  'HOSTING_STARTER',
  'HOSTING_STARTER_OVH',
  'HOSTING_FREE_100_M',
  'START_10_M',
];

export const REGEX_DB_OFFER_SORT = /(?:-|_)(\d+)(?:-|_)/;

export default {
  PRODUCT_NAME,
  DB_OFFERS,
  REGEX_DB_OFFER_SORT,
  OFFERS_WITHOUT_START_SQL,
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
};
