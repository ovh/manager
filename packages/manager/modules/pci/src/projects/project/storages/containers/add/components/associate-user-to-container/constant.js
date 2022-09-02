export const CONTAINER_USER_ASSOCIATION_MODES = {
  LINKED: 'LINKED',
  CREATE: 'CREATE',
};

export const ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES =
  'pci.projects.project.storages.containers.associate-user-to-container';

export const USER_STATUS = {
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
};

export const NAMESPACES = {
  CREATE_USER: 'pci_storages_create_user',
};

export const TRACKING_PREFIX = 'storage_container_add_user::';
export const TRACKING_CREATE_USER = 'create-user';
export const TRACKING_ASSOCIATE_USER = 'associate-user';
export const OBJECT_STORAGE_USER_ROLE = 'objectstore_operator';

export default {
  CONTAINER_USER_ASSOCIATION_MODES,
  ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
  USER_STATUS,
  NAMESPACES,
  TRACKING_PREFIX,
  TRACKING_CREATE_USER,
  TRACKING_ASSOCIATE_USER,
  OBJECT_STORAGE_USER_ROLE,
};
