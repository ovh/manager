export const DEFAULT_FILTER_ACTIVE_DIRECTORY = 'domainName';

export const DEFAULT_FILTER_USERS = 'name';

export const TRACKING_PREFIX = 'import';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  canceled: `${TRACKING_PREFIX}-canceled`,
  error: `${TRACKING_PREFIX}-error`,
};

export default {
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
  DEFAULT_FILTER_ACTIVE_DIRECTORY,
  DEFAULT_FILTER_USERS,
};
