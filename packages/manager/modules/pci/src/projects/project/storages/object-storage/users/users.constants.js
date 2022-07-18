export const DOWNLOAD_FILENAME = 'import.json';
export const DOWNLOAD_TYPE = 'application/json"';
export const TRACKING_S3_POLICY = 's3-policies-users';
export const TRACKING_S3_POLICY_ADD = 's3-policies-users::add';
export const TRACKING_S3_POLICY_DELETE = 's3-policies-users::delete';
export const NAMESPACES = {
  CREATE_USER: 'pci_storages_object-storage_users_user_add',
};
export const USER_STATUS = {
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
};

export default {
  DOWNLOAD_FILENAME,
  DOWNLOAD_TYPE,
  TRACKING_S3_POLICY,
  TRACKING_S3_POLICY_ADD,
  TRACKING_S3_POLICY_DELETE,
};
