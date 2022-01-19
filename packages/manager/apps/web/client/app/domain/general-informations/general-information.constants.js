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

export const DOMAIN_SERVICE_STATES = {
  expired: 'expired',
  delete_at_expiration: 'delete_at_expiration',
  automatic: 'automatic',
  manualPayment: 'manualPayment',
};

export const DOMAIN_STATE_TYPE = {
  error: [
    DOMAIN_SERVICE_STATES.expired,
    DOMAIN_SERVICE_STATES.delete_at_expiration,
  ],
  success: [DOMAIN_SERVICE_STATES.automatic],
  warning: [DOMAIN_SERVICE_STATES.manualPayment],
};

export default {
  DNSSEC_STATUS,
  OWNER_CHANGE_URL,
  PRODUCT_TYPE,
  PROTECTION_TYPES,
  DOMAIN_SERVICE_STATES,
  DOMAIN_STATE_TYPE,
};
