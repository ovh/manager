export const APP_LABELS = {
  MAX_CHARS: 15,
  MAX_ITEMS: 10,
};
export const APP_PRIVACY_SETTINGS = {
  RESTRICTED: 'restricted',
  PUBLIC: 'public',
};

export const APP_ATTACH_STORAGE = {
  MOUNT_PATH_REGEX: '^\\/(\\S)*$',
  PREFIX_REGEX: '(\\S)*$',
  URL_REGEX:
    'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
  PERMISSION_READ_ONLY: 'RO',
  PERMISSION_READ_WRITE: 'RW',
  MAX_VOLUMES: 10,
};

export const APP_PROBE = {
  MIN_PATH_LENGTH: 1,
  MAX_PATH_LENGTH: 1000,
  PATH_REGEX: '^[a-zA-Z0-9._-/]+$',
  MIN_PORT: 1024,
  MAX_PORT: 65535,
};

export default {
  APP_LABELS,
  APP_PRIVACY_SETTINGS,
};
