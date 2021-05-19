export const NOTEBOOK_TAGS = {
  LIMIT: 10,
};

export const NOTEBOOK_STATUS = {
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED',
};

export const NOTEBOOK_POLLER_NAMESPACES = {
  CHANGING: 'cloud.project.notebook.state.changing',
};

export const NOTEBOOK_STATES = {
  ERROR: [NOTEBOOK_STATUS.STOPPED, NOTEBOOK_STATUS.STOPPING],
  WARNING: [NOTEBOOK_STATUS.STARTING],
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

export const NOTEBOOK_AUTOMATION_INFO = {
  DEFAULT: 'https://docs.ovh.com/fr/logs-data-platform/kubernetes-fluent-bit/',
};

export const NOTEBOOK_STORAGE_INFO = {
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/data/',
};

export default {
  NOTEBOOK_TAGS,
  NOTEBOOK_STATUS,
  NOTEBOOK_STATES,
  NOTEBOOK_VOLUME_TYPE,
  NOTEBOOK_FLAVOR_TYPE,
  NOTEBOOK_AUTOMATION_INFO,
  NOTEBOOK_STORAGE_INFO,
  NOTEBOOK_POLLER_NAMESPACES,
};
