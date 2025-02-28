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

const TRACKING_PREFIX = 'web::hosting::database::';

const TRACKING_CATEGORY_PAGE_AND_THEME = {
  page_category: 'funnel',
  page_theme: 'Hosting',
  page: {
    name: `${TRACKING_PREFIX}database::funnel::add::database`,
  },
};

export const ORDER_DATABASE_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}database::funnel::add::database`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  GO_BACK: {
    name: `${TRACKING_PREFIX}funnel::link::add_database::go_back`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  OPTION: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_database::select_solution::next_{{databaseSolution}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::add_database::edit_step_database_solution`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  PRICING: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_database::confirm_{{databaseSolution}}_{{pricing}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
};

export default {
  PRODUCT_NAME,
  DB_OFFERS,
  REGEX_DB_OFFER_SORT,
  OFFERS_WITHOUT_START_SQL,
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
  ORDER_DATABASE_TRACKING,
};
