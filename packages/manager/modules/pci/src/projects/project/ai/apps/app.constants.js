export const APP_TAGS = {
  LIMIT: 10,
  MAX: 20,
};

export const APP_STATUS = {
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
};

export const APP_POLLER_NAMESPACES = {
  CHANGING: 'cloud.project.notebook.state.changing',
};

export const APP_STATES = {
  ERROR: [APP_STATUS.STOPPED, APP_STATUS.FAILED],
  WARNING: [APP_STATUS.STARTING, APP_STATUS.STOPPING],
  SUCCESS: [APP_STATUS.RUNNING],
};

export const APP_VOLUME_TYPE = {
  GIT: 'git',
  SWIFT: 'swift',
};

export const APP_FLAVOR_TYPE = {
  GPU: 'GPU',
  CPU: 'CPU',
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
  APP_FLAVOR_TYPE,
  APP_AUTOMATION_INFO,
  APP_STORAGE_INFO,
  APP_POLLER_NAMESPACES,
  APP_FRAMEWORK_INFO,
  APP_MULTIPLY_SIGN,
};
