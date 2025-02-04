const TRACKING_PREFIX = 'web::hosting::cdn::';

const TRACKING_CATEGORY_PAGE_AND_THEME = {
  page_category: 'funnel',
  page_theme: 'Hosting',
  page: {
    name: `${TRACKING_PREFIX}cdn::funnel::add_cdn`,
  },
};

export const ORDER_CDN_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}cdn::funnel::add_cdn`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  GO_BACK: {
    name: `${TRACKING_PREFIX}funnel::link::add_cdn::go_back`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  OPTION: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_cdn::select_option::next_{{cdnOption}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::add_cdn::edit_step_cdn_option`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  PRICING: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_cdn::select_pricing::next_{{pricing}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
};

export const HOSTING_CDN_CHANGE_TYPE = {
  DOWNGRADE: 'downgrade',
  UPGRADE: 'upgrade',
};
export const HOSTING_CDN_ORDER_CDN_VERSION_V1 = '2013v1';
export const HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC_FREE =
  'cdn-basic-free';
export const HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE =
  'cdn_free_business';
export const HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC = 'cdn-basic';
export const HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS =
  'cdn_business';

export const HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_ADVANCED =
  'cdn-advanced';

export const HOSTING_PRODUCT_NAME = 'webHosting';

export default {
  ORDER_CDN_TRACKING,
  HOSTING_CDN_CHANGE_TYPE,
  HOSTING_CDN_ORDER_CDN_VERSION_V1,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC_FREE,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_ADVANCED,
  HOSTING_PRODUCT_NAME,
};
