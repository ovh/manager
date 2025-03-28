const GROUP_ROLES = {
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR',
  UNPRIVILEGED: 'UNPRIVILEGED',
  NONE: 'NONE',
};

export { GROUP_ROLES };

const USER_GROUPS_TRACKING_PREFIX =
  'identity-security-operation::identity::user-groups::';

export const USER_GROUPS_TRACKING_HITS = {
  LISTING_PAGE: `${USER_GROUPS_TRACKING_PREFIX}listing`,
  ADD_USER_GROUP: `${USER_GROUPS_TRACKING_PREFIX}page::button::add_user_group`,
  ADD_USER_GROUP_MODAL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::add_user_group`,
  ADD_USER_GROUP_CANCEL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::add-user-group::cancel`,
  ADD_USER_GROUP_CONFIRM: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::add-user-group::validate`,
  ADD_USER_GROUP_SUCCESS: `${USER_GROUPS_TRACKING_PREFIX}banner-info::add-user-group_success`,
  ADD_USER_GROUP_ERROR: `${USER_GROUPS_TRACKING_PREFIX}banner-error::add-user-group_error`,
  UPDATE_USER_GROUP: `${USER_GROUPS_TRACKING_PREFIX}datagrid::button::update_user-group`,
  UPDATE_USER_GROUP_MODAL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::update_user-group`,
  UPDATE_USER_GROUP_CANCEL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::update-user-group::cancel`,
  UPDATE_USER_GROUP_CONFIRM: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::update-user-group::validate`,
  UPDATE_USER_GROUP_SUCCESS: `${USER_GROUPS_TRACKING_PREFIX}banner-info::update-user-group_success`,
  UPDATE_USER_GROUP_ERROR: `${USER_GROUPS_TRACKING_PREFIX}banner-error::update-user-group_error`,
  DELETE_USER_GROUP: `${USER_GROUPS_TRACKING_PREFIX}datagrid::button::delete_user-group`,
  DELETE_USER_GROUP_MODAL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::delete_user-group`,
  DELETE_USER_GROUP_CANCEL: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::delete-user-group::cancel`,
  DELETE_USER_GROUP_CONFIRM: `${USER_GROUPS_TRACKING_PREFIX}pop-up::button::delete-user-group::validate`,
  DELETE_USER_GROUP_SUCCESS: `${USER_GROUPS_TRACKING_PREFIX}banner-info::delete-user-group_success`,
  DELETE_USER_GROUP_ERROR: `${USER_GROUPS_TRACKING_PREFIX}banner-error::delete-user-group_error`,
};
