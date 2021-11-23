export const APP_TAGS = {
  LIMIT: 10,
  MAX: 20,
};

export const APP_STATUS = {
  QUEUED: 'QUEUED',
  INITIALIZING: 'INITIALIZING',
  SCALING: 'SCALING',
  RUNNING: 'RUNNING',
  DELETING: 'DELETING',
  DELETED: 'DELETED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
};

export const APP_POLLER_NAMESPACES = {
  CHANGING: 'cloud.project.notebook.state.changing',
};

export const APP_STATES = {
  ERROR: [APP_STATUS.FAILED, APP_STATUS.ERROR, APP_STATUS.DELETED],
  WARNING: [
    APP_STATUS.DELETING,
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
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/overview-cli/',
};

export const APP_STORAGE_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/data/',
  CA: 'https://docs.ovh.com/ca/en/ai-training/data/',
};

export const APP_MULTIPLY_SIGN = ' × ';

export default {
  APP_TAGS,
  APP_STATUS,
  APP_STATES,
  APP_VOLUME_TYPE,
  APP_AUTOMATION_INFO,
  APP_STORAGE_INFO,
  APP_POLLER_NAMESPACES,
  APP_FRAMEWORK_INFO,
  APP_MULTIPLY_SIGN,
};
