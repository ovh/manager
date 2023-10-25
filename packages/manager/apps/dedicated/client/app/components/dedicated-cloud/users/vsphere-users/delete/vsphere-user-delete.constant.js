export const TRACKING_PREFIX = 'user-delete';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  canceled: `${TRACKING_PREFIX}-canceled`,
  error: `${TRACKING_PREFIX}-error`,
};

export default {
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
