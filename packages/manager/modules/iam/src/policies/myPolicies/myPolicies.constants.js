export const MY_POLICIES_TRACKING_PREFIX =
  'identity-security-operation::policies::my-policies::';

export const MY_POLICIES_TRACKING_HITS = {
  LISTING_PAGE: `${MY_POLICIES_TRACKING_PREFIX}listing`,
  CREATE_POLICY: `${MY_POLICIES_TRACKING_PREFIX}page::button::create_policy`,
  CREATE_POLICY_PAGE: `${MY_POLICIES_TRACKING_PREFIX}create`,
  CREATE_POLICY_REMOVE_RESOURCE_TYPE: `${MY_POLICIES_TRACKING_PREFIX}page::button::create_policy::remove-product-type`,
  CREATE_POLICY_CANCEL: `${MY_POLICIES_TRACKING_PREFIX}page::button::create_policy::cancel`,
  CREATE_POLICY_CONFIRM: `${MY_POLICIES_TRACKING_PREFIX}page::button::create_policy::validate`,
  CREATE_POLICY_SUCCESS: `${MY_POLICIES_TRACKING_PREFIX}banner-info::create_policy_success`,
  CREATE_POLICY_ERROR: `${MY_POLICIES_TRACKING_PREFIX}banner-info::create_policy_error`,
  EDIT_POLICY: `${MY_POLICIES_TRACKING_PREFIX}datagrid::button::edit_policy`,
  EDIT_POLICY_PAGE: `${MY_POLICIES_TRACKING_PREFIX}edit`,
  EDIT_POLICY_REMOVE_RESOURCE_TYPE: `${MY_POLICIES_TRACKING_PREFIX}page::button::edit_policy::remove-product-type`,
  EDIT_POLICY_CANCEL: `${MY_POLICIES_TRACKING_PREFIX}page::button::edit_policy::cancel`,
  EDIT_POLICY_CONFIRM: `${MY_POLICIES_TRACKING_PREFIX}page::button::edit_policy::validate`,
  EDIT_POLICY_SUCCESS: `${MY_POLICIES_TRACKING_PREFIX}banner-info::edit_policy_success`,
  EDIT_POLICY_ERROR: `${MY_POLICIES_TRACKING_PREFIX}banner-info::edit_policy_error`,
  DELETE_POLICY: `${MY_POLICIES_TRACKING_PREFIX}datagrid::button::delete_policy`,
  DELETE_POLICY_MODAL: `${MY_POLICIES_TRACKING_PREFIX}pop-up::delete_policy`,
  DELETE_POLICY_CANCEL: `${MY_POLICIES_TRACKING_PREFIX}pop-up::button::delete_policy::cancel`,
  DELETE_POLICY_CONFIRM: `${MY_POLICIES_TRACKING_PREFIX}pop-up::button::delete_policy::validate`,
  DELETE_POLICY_SUCCESS: `${MY_POLICIES_TRACKING_PREFIX}banner-info::delete_policy_success`,
  DELETE_POLICY_ERROR: `${MY_POLICIES_TRACKING_PREFIX}banner-info::delete_policy_error`,
};
