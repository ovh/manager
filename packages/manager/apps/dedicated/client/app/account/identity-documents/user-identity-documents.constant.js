export const USER_TYPE = {
  corporation: 'enterprise',
  association: 'association',
  individual: 'particular',
  default: 'others',
};

export const MAX_SIZE = 100000000;

export const TRACKING_PREFIX = 'dedicated::account::identity-files';

export const TRACKING_TASK_TAG = {
  upload: `${TRACKING_PREFIX}::upload`,
  uploadSuccess: `${TRACKING_PREFIX}::upload-success`,
  uploadError: `${TRACKING_PREFIX}::upload-error`,
};

export default {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
