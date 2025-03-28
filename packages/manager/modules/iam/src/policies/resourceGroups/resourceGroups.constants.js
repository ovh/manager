export const RESOURCE_GROUPS_TRACKING_PREFIX =
  'identity-security-operation::policies::group-resources::';

export const RESOURCE_GROUPS_TRACKING_HITS = {
  LISTING_PAGE: `${RESOURCE_GROUPS_TRACKING_PREFIX}listing`,
  ADD_RESOURCE_GROUP: `${RESOURCE_GROUPS_TRACKING_PREFIX}page::button::add_resource_group`,
  ADD_RESOURCE_GROUP_PAGE: `${RESOURCE_GROUPS_TRACKING_PREFIX}add_resource_group`,
  ADD_RESOURCE_GROUP_REMOVE_PRODUCT_TYPE: `${RESOURCE_GROUPS_TRACKING_PREFIX}add_resource-group::remove-product-type`,
  ADD_RESOURCE_GROUP_CANCEL: `${RESOURCE_GROUPS_TRACKING_PREFIX}page::button::add-resource-group::cancel`,
  ADD_RESOURCE_GROUP_CONFIRM: `${RESOURCE_GROUPS_TRACKING_PREFIX}page::button::add-resource-group::validate`,
  ADD_RESOURCE_GROUP_SUCCESS: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-info::add-resource-group_success`,
  ADD_RESOURCE_GROUP_ERROR: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-error::add-resource-group_error`,
  UPDATE_RESOURCE_GROUP: `${RESOURCE_GROUPS_TRACKING_PREFIX}datagrid::button::update_resource-group`,
  UPDATE_RESOURCE_GROUP_PAGE: `${RESOURCE_GROUPS_TRACKING_PREFIX}update_resource-group`,
  UPDATE_RESOURCE_GROUP_REMOVE_PRODUCT_TYPE: `${RESOURCE_GROUPS_TRACKING_PREFIX}update_resource-group::remove-product-type`,
  UPDATE_RESOURCE_GROUP_CANCEL: `${RESOURCE_GROUPS_TRACKING_PREFIX}page::button::update-resource-group::cancel`,
  UPDATE_RESOURCE_GROUP_CONFIRM: `${RESOURCE_GROUPS_TRACKING_PREFIX}page::button::update-resource-group::validate`,
  UPDATE_RESOURCE_GROUP_SUCCESS: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-info::update-resource-group_success`,
  UPDATE_RESOURCE_GROUP_ERROR: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-error::update-resource-group_error`,
  DELETE_RESOURCE_GROUP: `${RESOURCE_GROUPS_TRACKING_PREFIX}datagrid::button::delete_resource-group`,
  DELETE_RESOURCE_GROUP_MODAL: `${RESOURCE_GROUPS_TRACKING_PREFIX}pop-up::delete_resource-group`,
  DELETE_RESOURCE_GROUP_CANCEL: `${RESOURCE_GROUPS_TRACKING_PREFIX}pop-up::button::delete-resource-group::cancel`,
  DELETE_RESOURCE_GROUP_CONFIRM: `${RESOURCE_GROUPS_TRACKING_PREFIX}pop-up::button::delete-resource-group::validate`,
  DELETE_RESOURCE_GROUP_SUCCESS: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-info::delete-resource-group_success`,
  DELETE_RESOURCE_GROUP_ERROR: `${RESOURCE_GROUPS_TRACKING_PREFIX}banner-error::delete-resource-group_error`,
};
