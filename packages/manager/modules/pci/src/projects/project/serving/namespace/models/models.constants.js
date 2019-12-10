export const PROCESSING_API_STATUS = [
  'pending',
  'starting',
  'scaling',
];

export const API_STATUS = {
  pending: 'pending',
  starting: 'starting',
  running: 'running',
  scaling: 'scaling',
  waking: 'waking',
  sleeping: 'sleeping',
};

export const VERSION_STATUS = {
  pending: 'pending',
  building: 'building',
  built: 'built',
  'build-error': 'build-error',
  deploying: 'deploying',
  deployed: 'deployed',
  rollback: 'rollback',
  failed: 'failed',
};

export const PROCESSING_VERSION_STATUS = [
  'pending',
  'building',
  'built',
  'deploying',
  'rollback',
];

export const ERROR_VERSION_STATUS = [
  'failed',
  'build-error',
];

export default {
  PROCESSING_API_STATUS,
  API_STATUS,
  VERSION_STATUS,
  PROCESSING_VERSION_STATUS,
  ERROR_VERSION_STATUS,
};
