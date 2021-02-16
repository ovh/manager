export const PRODUCT_TYPE = 'DOMAIN';

export const DNSSEC_STATUS = {
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  DISABLE_IN_PROGRESS: 'disable_in_progress',
  ENABLE_IN_PROGRESS: 'enable_in_progress',
};

export const OWNER_CHANGE_URL = '#/contact/';

export const PROTECTION_TYPES = {
  LOCKED: 'locked',
  LOCKING: 'locking',
  UNAVAILABLE: 'unavailable',
  UNLOCKING: 'unlocking',
};

export default {
  DNSSEC_STATUS,
  OWNER_CHANGE_URL,
  PRODUCT_TYPE,
  PROTECTION_TYPES,
};
