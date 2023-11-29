export const IS_BETA = true;
export const APP_TAGS = {
  LIMIT: 10,
  MAX: 20,
};

export const APP_TYPES = {
  CPU: 'cpu',
  GPU: 'gpu',
};

export const APP_DATA_SYNC_TYPES = ['push', 'pull'];

export const APP_STATUS = {
  QUEUED: 'QUEUED',
  INITIALIZING: 'INITIALIZING',
  SCALING: 'SCALING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED',
  DELETING: 'DELETING',
  DELETED: 'DELETED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
};

export const APP_POLLER_NAMESPACES = {
  CHANGING: 'cloud.project.app.state.changing',
};

export const APP_STATES = {
  ERROR: [APP_STATUS.FAILED, APP_STATUS.ERROR, APP_STATUS.STOPPED],
  WARNING: [
    APP_STATUS.STOPPING,
    APP_STATUS.SCALING,
    APP_STATUS.INITIALIZING,
    APP_STATUS.QUEUED,
  ],
  SUCCESS: [APP_STATUS.RUNNING],
};

export const APP_VOLUME_TYPE = {
  GIT: 'git',
  SWIFT: 'swift',
};

export const APP_FRAMEWORK_INFO = {
  DEFAULT: 'https://community.ovh.com/en/c/Data-AI',
};

export const APP_AUTOMATION_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/cli/overview-cli/',
};

export const APP_STORAGE_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/data/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/data/',
};

export const APP_LABELS_INFO = {
  DEFAULT:
    'https://docs.ovh.com/gb/en/publiccloud/ai/deploy/tokens/#adding-labels-to-an-app',
};

export const APP_DOCKER_IMAGE_PORTFOLIO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/deploy/apps-portfolio',
};

export const APP_CUSTOM_DOCKER_IMAGE_DOC = {
  DEFAULT:
    'https://docs.ovh.com/gb/en/publiccloud/ai/deploy/build-use-custom-image',
};

export const APP_SCALING_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/deploy/apps-deployments',
};

export const APP_MULTIPLY_SIGN = ' × ';

export const APP_SPEC_WEIGHTS = {
  CPU: 1,
  GPU: 3,
  REPLICAS: 2,
};

export const APP_PARTNER_PRESET_LICENSING = {
  PER_APP: 'per-app',
  PER_RESOURCE: 'per-resource',
  PER_REPLICA: 'per-replica',
  PER_SECOND_BRACKET: 'per-second-bracket',
  FREE: 'per-free',
};

export const APP_PARTNER_VOXIST_DETAILS = {
  partnerId: 'voxist',
  pricesLink: {
    DEFAULT: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#11264',
    DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#11264',
    ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#11264',
    FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#11264',
    GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#11264',
    IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#11264',
    IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#11264',
    LT: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#11264',
    MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#11264',
    NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#11264',
    PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#11264',
    PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#11264',
    SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#11264',
    TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#11264',
  },
};

export const APP_USERS_TOKENS_BANNER_TRACKING = 'banner-manage-users-tokens';

export default {
  IS_BETA,
  APP_TAGS,
  APP_TYPES,
  APP_STATUS,
  APP_STATES,
  APP_VOLUME_TYPE,
  APP_AUTOMATION_INFO,
  APP_STORAGE_INFO,
  APP_LABELS_INFO,
  APP_POLLER_NAMESPACES,
  APP_FRAMEWORK_INFO,
  APP_DOCKER_IMAGE_PORTFOLIO,
  APP_CUSTOM_DOCKER_IMAGE_DOC,
  APP_SCALING_INFO,
  APP_MULTIPLY_SIGN,
  APP_PARTNER_PRESET_LICENSING,
  APP_PARTNER_VOXIST_DETAILS,
  APP_USERS_TOKENS_BANNER_TRACKING,
  APP_DATA_SYNC_TYPES,
};
