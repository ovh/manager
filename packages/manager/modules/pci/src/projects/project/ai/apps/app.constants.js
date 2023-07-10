export const IS_BETA = true;
export const APP_TAGS = {
  LIMIT: 10,
  MAX: 20,
};

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

export default {
  IS_BETA,
  APP_TAGS,
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
};
