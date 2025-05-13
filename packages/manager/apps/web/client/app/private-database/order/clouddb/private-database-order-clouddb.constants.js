export const DATACENTER_CONFIGURATION_KEY = 'dc';
export const ENGINE_CONFIGURATION_KEY = 'engine';
export const PLAN_CODE_TEMPLATE = 'cloud-db-xxxx-instance';
export const PRODUCT_NAME = 'cloudDB';
export const PRESELECTED_DB_CATEGORY = 'private';

const TRACKING_PREFIX = 'web::webclouddb::::';

const TRACKING_CATEGORY_PAGE_AND_THEME = {
  page_category: 'funnel',
  page_theme: 'Hosting',
  page: {
    name: `${TRACKING_PREFIX}webclouddb::funnel::add_webclouddb`,
  },
};

export const ORDER_WEBCLOUD_DATABASE_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}webclouddb::funnel::add_webclouddb`,
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
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
  PLAN_CODE_TEMPLATE,
  PRODUCT_NAME,
  PRESELECTED_DB_CATEGORY,
  ORDER_WEBCLOUD_DATABASE_TRACKING,
};
