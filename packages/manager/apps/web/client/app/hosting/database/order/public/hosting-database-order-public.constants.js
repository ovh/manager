export const PRODUCT_NAME = 'webHosting';

export const DB_OFFERS = {
  STARTER: {
    PLAN_CODE_PREFIX: 'sql_optional_',
    CATEGORY: 'starter',
    FAMILY: null,
    TRACKING: 'Start_SQL',
  },
  PRIVATE: {
    PLAN_CODE_PREFIX: 'private_sql_',
    CATEGORY: 'private',
    FAMILY: 'cloud-db',
    TRACKING: 'Web_Cloud_database',
  },
};

export const REGEX_DB_OFFER_SORT = /(?:-|_)(\d+)(?:-|_)/;

export default {
  PRODUCT_NAME,
  DB_OFFERS,
  REGEX_DB_OFFER_SORT,
};
