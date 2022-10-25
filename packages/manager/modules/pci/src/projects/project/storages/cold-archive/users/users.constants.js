export const DOWNLOAD_FILENAME = 'import.json';
export const DOWNLOAD_TYPE = 'application/json"';
export const NAMESPACES = {
  CREATE_USER: 'pci_storages_object-storage_users_user_add',
};
export const TRACKING = {
  USER_PAGE: 'dashboard::s3_users',
  ADD_USER: 'dashboard::s3_users::add_a_user',
  DELETE_USER: 'dashboard::s3_users::action_menu::delete_user_credentials',
  ADD_POLICY: 'dashboard::s3_users::action_menu::add_s3_policy',
  DELETE_POLICY: 'dashboard::s3_users::action_menu::delete_s3_policy',
  IMPORT_POLICY: 'dashboard::s3_users::action_menu::import_s3_policy',
  DOWNLOAD_POLICY: 'dashboard::s3_users::action_menu::download_s3_policy',
  DOWNLOAD_RCLONE: 'dashboard::s3_users::action_menu::download_rClone_file',
  DISPLAY_SECRET: 'dashboard::s3_users::action_menu::display_secret_key',
  GENERATE_CREDENTIAL:
    'dashboard::s3_users::action_menu::generate_user_credentials',
  DELETE_CREDENTIALS:
    'dashboard::s3_users::action_menu::delete_user_credentials',
};

export const USER_STATUS = {
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
};

export const OBJECT_STORAGE_USER_ROLE = 'objectstore_operator';

export default {
  DOWNLOAD_FILENAME,
  DOWNLOAD_TYPE,
  TRACKING,
  OBJECT_STORAGE_USER_ROLE,
};
