export const DEDICATED_CLOUD_CONSTANTS = {
  securityOptions: ['pcidss', 'hds', 'hipaa'],
  pccNewGeneration: '2.0',
};

export const TASK_STATUS = {
  DONE: 'done',
  ERROR: 'error',
  CANCELED: 'canceled',
};

export const UNAVAILABLE_PCC_CODE = [400, 404];

export default {
  DEDICATED_CLOUD_CONSTANTS,
  UNAVAILABLE_PCC_CODE,
  TASK_STATUS,
};
