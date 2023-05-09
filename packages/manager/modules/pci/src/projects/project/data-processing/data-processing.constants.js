export const DATA_PROCESSING_STATUS_TO_CLASS = Object.freeze({
  PENDING: 'warning',
  SUBMITTED: 'warning',
  RUNNING: 'info',
  FAILED: 'error',
  COMPLETED: 'success',
  TERMINATED: 'error',
});

export const DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS = Object.freeze({
  DELETING: 'warning',
  FAILED: 'error',
  RUNNING: 'success',
  STARTING: 'warning',
  STOPPED: 'info',
  STOPPING: 'warning',
});

export const DATA_PROCESSING_STATUSES = Object.freeze({
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  RUNNING: 'Running',
  FAILED: 'Failed',
  COMPLETED: 'Completed',
  TERMINATED: 'Killed',
});

export const DATA_PROCESSING_NOTEBOOKS_STATUSES = Object.freeze({
  DELETED: 'DELETED',
  FAILED: 'FAILED',
  RUNNING: 'RUNNING',
  STARTING: 'STARTING',
  STOPPED: 'STOPPED',
  STOPPING: 'STOPPING',
});

export const DATA_PROCESSING_NOTEBOOKS_TRANSITION_STATUSES = [
  DATA_PROCESSING_NOTEBOOKS_STATUSES.STARTING,
  DATA_PROCESSING_NOTEBOOKS_STATUSES.STOPPING,
];

export const DATA_PROCESSING_API_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  TERMINATED: 'TERMINATED',
});

export const DATA_PROCESSING_ENDED_JOBS = [
  DATA_PROCESSING_API_STATUSES.FAILED,
  DATA_PROCESSING_API_STATUSES.COMPLETED,
  DATA_PROCESSING_API_STATUSES.TERMINATED,
];

export const DATA_PROCESSING_UI_URL = {
  GRA: 'https://adc.gra.dataconvergence.ovh.com',
  GRA5: 'https://adc.gra.dataconvergence.ovh.com',
};

export const DATA_PROCESSING_GUIDE_URL =
  'https://docs.ovh.com/gb/en/data-processing/';

export default {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
  DATA_PROCESSING_UI_URL,
  DATA_PROCESSING_GUIDE_URL,
  DATA_PROCESSING_API_STATUSES,
  DATA_PROCESSING_ENDED_JOBS,
};

export const METRICS_REFRESH_INTERVAL = 5000;

export const NOTEBOOK_REFRESH_INTERVAL = 5000;

export const JOB_TYPE_PYTHON = 'python';
export const JOB_TYPE_JAVA = 'java';

export const SUBMIT_JOB_API_GUIDES = {
  DEFAULT: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  ASIA: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  AU: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  CA: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  FR: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  GB: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  IE: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  QC: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
  SG: 'https://docs.ovh.com/gb/en/data-processing/use-api/',
};

export const GIB_IN_MIB = 1024;

export const NOTEBOOK_CLUSTER_NAME = 'NB1-1';

export const DATA_PROCESSING_TRACKING_PREFIX =
  'pci::projects::project::data-processing';

export const PUBLIC_CLOUD_TRACKING_PREFIX = 'PublicCloud';

export const DATA_PROCESSING_TRACKING_PREFIX_FULL = `${PUBLIC_CLOUD_TRACKING_PREFIX}::${DATA_PROCESSING_TRACKING_PREFIX}`;
