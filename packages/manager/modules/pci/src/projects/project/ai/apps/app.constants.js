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

export const SPECIAL_CONDITIONS = {
  CA: {
    fr_FR:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    fr_CA:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
  EU: {
    fr_FR:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
  US: {
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
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
