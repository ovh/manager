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
  start: 'Starter',
  develop: 'Develop',
  expand: 'Expand',
};

export const STORAGE_VALUES = {
  MAX_FOR_EXPAND_PLAN: 100,
  MAX_FOR_OTHER_PLANS: 20,
};

export const ENVIRONMENT_VALUES = {
  MAX: 50,
};

export const LICENCES_VALUES = {
  MAX: 100,
};

export default {
  BETA_PLAN_CODE,
  ENVIRONMENT_VALUES,
  GUIDELINK,
  OFFER_NAME,
  LICENCES_VALUES,
  STATUS,
  STORAGE_VALUES,
};
