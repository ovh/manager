export const BYOI_STATUS_ENUM = {
  DOING: 'doing',
  DONE: 'done',
  ERROR: 'error',
};

export const BYOI_STARTING_MESSAGE = 'starting';

export const PROGRESS_TASK_STATUS = {
  DOING: ['doing'],
  ENDING: ['done'],
  ERROR: ['customer_error', 'ovh_error', 'error', 'cancelled'],
};

export default {
  PROGRESS_TASK_STATUS,
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
};
