export const PRESELECTED_DB_CATEGORY = 'private';
export const WEBHOSTING_PRODUCT_NAME = 'webHosting';
export const PRIVATE_SQL_PLAN_CODE_PREFIX = 'private-sql';

const TRACKING_PREFIX = 'web::hosting::database::';

const TRACKING_CATEGORY_PAGE_AND_THEME = {
  page_category: 'funnel',
  page_theme: 'Hosting',
  page: {
    name: `${TRACKING_PREFIX}database::funnel::activate::database`,
  },
};

export const ACTIVATION_DATABASE_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}database::funnel::activate_database::database`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  GO_BACK: {
    name: `${TRACKING_PREFIX}funnel::link::activate_database::go_back`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  OPTION: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::activate_database::select_solution::next_{{databaseSolution}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::activate_database::edit_step_database_solution`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  PRICING: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::activate_database::confirm_{{databaseSolution}}_{{pricing}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
};

export default {
  PRESELECTED_DB_CATEGORY,
  WEBHOSTING_PRODUCT_NAME,
  PRIVATE_SQL_PLAN_CODE_PREFIX,
  ACTIVATION_DATABASE_TRACKING,
};
