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

export const DEFAULT_PLANCODE = 'cloudweb1';

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

export default {
  CONFIGURATION_OPTIONS,
  DATABASE_ISOLATION_TYPES,
  DEFAULT_PLANCODE,
  DISK_SIZE_MULTIPLE,
  DISK_SIZE_UNIT,
  HIGHLIGHTS,
  OPTION_QUANTITY,
  PRODUCT_QUANTITY,
  WEBHOSTING_ORDER_PRODUCT,
};
