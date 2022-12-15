export const ISO_DURATION_FORMAT = {
  PREFIX: 'P',
  DAY: 'd',
  MONTH: 'M',
  NONE: 'd',
  YEAR: 'Y',
};

export const PRICING_CAPACITIES = {
  DETACH: 'detach',
  DOWNGRADE: 'downgrade',
  INSTALLATION: 'installation',
  RENEW: 'renew',
  UPGRADE: 'upgrade',
};

export const PRICING_MODE = {
  DEFAULTS: {
    CREATE: 'create-default',
    DEFAULT: 'default',
    TRANSFER: 'transfer-default',
    PREMIUM: 'premium-default',
    CREATE_PREMIUM: 'create-premium',
    TRANSFER_PREMIUM: 'transfer-premium',
    TRANSFER_AFTERMARKET1: 'transfer-aftermarket1',
    TRANSFER_AFTERMARKET2: 'transfer-aftermarket2',
    RESTORE_PREMIUM: 'restore-premium',
    RESTORE_DEFAULT: 'restore-default',
  },
};

export default {
  ISO_DURATION_FORMAT,
  PRICING_CAPACITIES,
  PRICING_MODE,
};
