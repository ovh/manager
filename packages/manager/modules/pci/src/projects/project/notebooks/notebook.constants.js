export const NOTEBOOK_TAGS = {
  LIMIT: 10,
  MAX: 20,
};

export const NOTEBOOK_STATUS = {
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
  DELETING: 'DELETING',
  SYNC_FAILED: 'SYNC_FAILED',
};

export const NOTEBOOK_POLLER_NAMESPACES = {
  CHANGING: 'cloud.project.notebook.state.changing',
};

export const NOTEBOOK_STATES = {
  ERROR: [
    NOTEBOOK_STATUS.STOPPED,
    NOTEBOOK_STATUS.FAILED,
    NOTEBOOK_STATUS.SYNC_FAILED,
  ],
  WARNING: [
    NOTEBOOK_STATUS.STARTING,
    NOTEBOOK_STATUS.STOPPING,
    NOTEBOOK_STATUS.DELETING,
  ],
  SUCCESS: [NOTEBOOK_STATUS.RUNNING],
};

export const NOTEBOOK_VOLUME_TYPE = {
  GIT: 'git',
  SWIFT: 'swift',
};

export const NOTEBOOK_FLAVOR_TYPE = {
  GPU: 'GPU',
  CPU: 'CPU',
};

export const NOTEBOOK_FRAMEWORK_INFO = {
  DEFAULT: 'https://discord.com/invite/vXVurFfwe9',
};

export const NOTEBOOK_AUTOMATION_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/cli/overview-cli/',
};

export const NOTEBOOK_STORAGE_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/data/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/data/',
};

export const NOTEBOOK_MULTIPLY_SIGN = ' × ';

export const NOTEBOOK_FREE_WORKSPACE_STORAGE_DEFAULT = 10737418420;

export const NOTEBOOK_MINUTES_IN_HOUR = 60;

export const NOTEBOOK_MAX_PROGRESS_VALUE = 100;

export default {
  NOTEBOOK_TAGS,
  NOTEBOOK_STATUS,
  NOTEBOOK_STATES,
  NOTEBOOK_VOLUME_TYPE,
  NOTEBOOK_FLAVOR_TYPE,
  NOTEBOOK_AUTOMATION_INFO,
  NOTEBOOK_STORAGE_INFO,
  NOTEBOOK_POLLER_NAMESPACES,
  NOTEBOOK_FRAMEWORK_INFO,
  NOTEBOOK_MULTIPLY_SIGN,
  NOTEBOOK_FREE_WORKSPACE_STORAGE_DEFAULT,
  NOTEBOOK_MINUTES_IN_HOUR,
  NOTEBOOK_MAX_PROGRESS_VALUE,
};
