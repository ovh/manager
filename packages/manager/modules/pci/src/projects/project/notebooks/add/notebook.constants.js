export const NOTEBOOK_LABELS = {
  MAX_CHARS: 15,
  MAX_ITEMS: 10,
};
export const NOTEBOOK_PRIVACY_SETTINGS = {
  RESTRICTED: 'restricted',
  PUBLIC: 'public',
};
export const NOTEBOOK_RESOURCES = {
  STANDARD: 'standard', // CPU flavors
  ADVANCED: 'advanced', // GPU flavors
  STANDARD_FLAVOR: 'cpu',
  ADVANCED_FLAVOR: 'gpu',
  NB_RESOURCES: 1,
};
export const NOTEBOOK_ATTACH_STORAGE = {
  MOUNT_PATH_REGEX: '^\\/(\\S)*$',
  PREFIX_REGEX: '(\\S)*$',
  URL_REGEX:
    'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)\n',
  PERMISSION_READ_ONLY: 'RO',
  PERMISSION_READ_WRITE: 'RW',
  MAX_VOLUMES: 10,
};

export default {
  NOTEBOOK_LABELS,
  NOTEBOOK_PRIVACY_SETTINGS,
  NOTEBOOK_RESOURCES,
};
