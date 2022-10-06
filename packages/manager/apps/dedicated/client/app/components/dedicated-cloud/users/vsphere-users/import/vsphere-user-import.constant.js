export const DEFAULT_FILTER_COLUMN = 'domainName';

export const TRACKING_PREFIX = 'import';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  canceled: `${TRACKING_PREFIX}-canceled`,
  error: `${TRACKING_PREFIX}-error`,
};

export default {
  DEFAULT_FILTER_COLUMN,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
