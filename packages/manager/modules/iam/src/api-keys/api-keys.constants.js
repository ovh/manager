const API_KEYS_TRACKING_PREFIX =
  'identity-security-operation::applications::applications::';

export const API_KEYS_TRACKING_HITS = {
  ONBOARDING_PAGE: `${API_KEYS_TRACKING_PREFIX}onboarding`,
  LISTING_PAGE: `${API_KEYS_TRACKING_PREFIX}listing`,
  DELETE: `${API_KEYS_TRACKING_PREFIX}datagrid::button::delete_application`,
  DELETE_MODAL: `${API_KEYS_TRACKING_PREFIX}pop-up::delete_application`,
  DELETE_CONFIRM: `${API_KEYS_TRACKING_PREFIX}pop-up::button::delete_application::delete`,
  DELETE_CANCEL: `${API_KEYS_TRACKING_PREFIX}pop-up::button::delete_application::cancel`,
  DELETE_SUCCESS: `${API_KEYS_TRACKING_PREFIX}banner-info::delete-application_success`,
  DELETE_ERROR: `${API_KEYS_TRACKING_PREFIX}banner-error::delete-application_error`,
};
