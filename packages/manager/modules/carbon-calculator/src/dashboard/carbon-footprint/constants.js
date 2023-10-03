export const TASK_STATUS_ENUM = {
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
};

export const API_ROOT_PATH = '/me/carbonCalculator/';

export const INVOICE_API_PATH = `${API_ROOT_PATH}invoice`;

export const TASK_API_PATH = `${API_ROOT_PATH}task`;

export const TRACKING_NAME = 'dedicated::account::carbon_consumption';

export const API_FETCH_INTERVAL = 3000;

export default {
  TASK_STATUS_ENUM,
  INVOICE_API_PATH,
  TASK_API_PATH,
  API_FETCH_INTERVAL,
  TRACKING_NAME,
};
