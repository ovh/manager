export const STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  CANCELLING: 'CANCELLING',
  CANCELLATION_REQUESTED: 'CANCELLATION_REQUESTED',
  TERMINATED: 'TERMINATED',
  SUSPENDED: 'SUSPENDED',
  ERROR: 'ERROR',
};

export const BETA_PLAN_CODE = 'start-1';

export const GUIDELINK = {
  EN: 'https://docs.ovh.com/gb/en/web-paas/',
  FR: 'https://docs.ovh.com/gb/en/web-paas/',
};

export const OFFER_NAME = {
  start: 'Start',
  develop: 'Develop',
  expand: 'Expand',
};

export const PLAN_CODE = {
  START: 'start',
  DEVELOP: 'develop',
  EXPAND: 'expand',
};

export const SORT_ORDER_PLANS = ['start', 'develop', 'expand'];

export const ADDON_FAMILY = {
  STORAGE: 'storage',
  ENVIRONMENT: 'staging_environment',
  LICENSE: 'user_license',
};

export const ADDON_TYPE = {
  STORAGE: 'additional-storage',
  ENVIRONMENT: 'additional-staging-environment',
  LICENCES: 'additional-user-license',
};

export const STORAGE_VALUES = {
  MAX_FOR_EXPAND_PLAN: 100,
  MAX_FOR_OTHER_PLANS: 100,
};

export const ENVIRONMENT_VALUES = {
  MAX: 50,
};

export const LICENCES_VALUES = {
  MAX: 100,
};
export const STORAGE_MULTIPLE = 5;
export const DEFAULT_ENVIRONMENT = 2;

export default {
  ADDON_FAMILY,
  ADDON_TYPE,
  BETA_PLAN_CODE,
  ENVIRONMENT_VALUES,
  GUIDELINK,
  OFFER_NAME,
  LICENCES_VALUES,
  PLAN_CODE,
  STATUS,
  STORAGE_VALUES,
  STORAGE_MULTIPLE,
  SORT_ORDER_PLANS,
};
