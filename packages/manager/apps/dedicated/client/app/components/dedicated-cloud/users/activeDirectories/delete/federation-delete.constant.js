export const TRACKING_PREFIX = 'delete-active-directory';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  error: `${TRACKING_PREFIX}-error`,
};

export default {
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
