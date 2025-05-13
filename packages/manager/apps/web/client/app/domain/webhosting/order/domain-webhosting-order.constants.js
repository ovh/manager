export const CONFIGURATION_OPTIONS = {
  DNS_ZONE: {
    LABEL: 'dns_zone',
    VALUES: {
      NO_CHANGE: 'NO_CHANGE',
      RESET_ALL: 'RESET_ALL',
      RESET_ONLY_A: 'RESET_ONLY_A',
      RESET_ONLY_MX: 'RESET_ONLY_MX',
    },
  },
  LEGACY_DOMAIN: 'legacy_domain',
};

export const DATABASE_ISOLATION_TYPES = {
  DEDICATED: 'dedicated',
  LOCAL: 'local',
  SHARED: 'shared',
};

export const DISK_SIZE_MULTIPLE = {
  THOUSAND: 1000,
  MILLION: 1000000,
};

export const DISK_SIZE_UNIT = {
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
};

export const HIGHLIGHTS = {
  BEST_SELLER: 'best-seller',
  NEW: 'new',
};

export const OPTION_QUANTITY = 1;

export const PRODUCT_QUANTITY = 1;

export const WEBHOSTING_ORDER_PRODUCT = 'webHosting';

const TRACKING_PREFIX = 'web::hosting::hostingplan::';

const TRACKING_CATEGORY_PAGE_AND_THEME = {
  page_category: 'funnel',
  page_theme: 'Hosting',
  page: {
    name: `${TRACKING_PREFIX}hostingplan::funnel::add_hostingplan`,
  },
};

export const ORDER_WEBHOSTING_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}hostingplan::funnel::add::hostingplan`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  GO_BACK: {
    name: `${TRACKING_PREFIX}funnel::link::add_hostingplan::go_back`,
    ...TRACKING_CATEGORY_PAGE_AND_THEME,
  },
  OPTION: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::next_{{hostingSolution}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    DETAIL: {
      name: `${TRACKING_PREFIX}funnel::toggle_{{status}}::add_hostingplan::activate_product-details`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::edit_step_hosting_solution`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  PRE_INSTALL: {
    CMS: {
      name: `${TRACKING_PREFIX}funnel::tile::add_hostingplan::next_{{cms}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::edit_step_cms`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  DNS: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::next_{{dnsConfig}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
    EDIT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::edit_step_dns_config`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
  PRICING: {
    NEXT: {
      name: `${TRACKING_PREFIX}funnel::button::add_hostingplan::confirm_{{hostingSolution}}_{{cms}}_{{dnsConfig}}`,
      ...TRACKING_CATEGORY_PAGE_AND_THEME,
    },
  },
};

export default {
  CONFIGURATION_OPTIONS,
  DATABASE_ISOLATION_TYPES,
  DISK_SIZE_MULTIPLE,
  DISK_SIZE_UNIT,
  HIGHLIGHTS,
  OPTION_QUANTITY,
  PRODUCT_QUANTITY,
  WEBHOSTING_ORDER_PRODUCT,
  ORDER_WEBHOSTING_TRACKING,
};
