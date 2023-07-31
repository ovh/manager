export const TASK_STATUS_ENUM = {
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
};

export const API_PATH = '/me/carbonCalculator/task';

export const TRACKING_NAME = 'dedicated::account::carbon_consumption';

export const API_FETCH_INTERVAL = 3000;

export default {
  TASK_STATUS_ENUM,
  API_PATH,
  API_FETCH_INTERVAL,
  TRACKING_NAME,
};
