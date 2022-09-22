export const APP_IMAGE = {
  PLACEHOLDER: 'ovhcom/ai-deploy-hello-world:latest',
};

export const AUTOMATIC_SCALING_RESOURCE_TYPES = {
  CPU: 'CPU',
  RAM: 'RAM',
};

export const APP_SCALING_SETTINGS = {
  FIXED: {
    MIN_REPLICAS: 1,
    MAX_REPLICAS: 10,
    DEFAULT_REPLICAS: 1,
  },
  AUTOMATIC: {
    MIN_MIN_REPLICAS: 1,
    MAX_MIN_REPLICAS: 100,
    DEFAULT_MIN_REPLICAS: 1,

    MAX_MAX_REPLICAS: 100,
    DEFAULT_MAX_REPLICAS: 1,

    DEFAULT_RESOURCE: AUTOMATIC_SCALING_RESOURCE_TYPES.CPU,

    MIN_THRESHOLD: 1,
    MAX_THRESHOLD: 100,
    DEFAULT_THRESHOLD: 75,
  },
};

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
  PATH_REGEX: /^([\w-._/]*)$/,
  MIN_PORT: 1024,
  MAX_PORT: 65535,
};

export default {
  APP_IMAGE,
  AUTOMATIC_SCALING_RESOURCE_TYPES,
  APP_SCALING_SETTINGS,
  APP_LABELS,
  APP_PRIVACY_SETTINGS,
  APP_PROBE,
};
