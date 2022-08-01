export const ISSUE_CATEGORY = 'assistance';
export const ISSUE_SERVICE_TYPE = 'cloud_project';
export const ISSUE_TYPE_IDS = [33381, 33382, 43227, 44486, 44800, 44801];
export const QUOTA_INCREASE_MODES = {
  CONTACT_SUPPORT: 'contact-support',
  BUY_CREDITS: 'buy-credits',
};
export const TRACK = {
  BASE: 'PublicCloud::pci::projects::project::quota',
  SELECT_PLAN: 'select-plan',
  CONTACT_SUPPORT: 'increase-contact',
  BASE_CONTACT_SUPPORT_BANNER: 'PublicCloud::quota-contact-banner',
  BASE_SELECT_PLAN_BANNER: 'PublicCloud::quota-select-plan-banner',
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
  ERROR: 'error',
  SUCCESS: 'success',
};
export default {
  ISSUE_CATEGORY,
  ISSUE_SERVICE_TYPE,
  ISSUE_TYPE_IDS,
  QUOTA_INCREASE_MODES,
  TRACK,
};
