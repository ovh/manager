export const DEFAULT_TIMER = 5000;

export const TASK_STATE = {
  done: 'done',
  canceled: 'canceled',
  doing: 'doing',
  error: 'error',
  problem: 'problem',
  todo: 'todo',
  fixing: 'fixing',
  toCancel: 'toCancel',
  toCreate: 'toCreate',
  unknown: 'unknown',
  waitingForChilds: 'waitingForChilds',
  waitingTodo: 'waitingTodo',
};

export const STATUS_POLL_READY = [
  TASK_STATE.doing,
  TASK_STATE.toCancel,
  TASK_STATE.toCreate,
  TASK_STATE.todo,
  TASK_STATE.waitingForChilds,
  TASK_STATE.waitingTodo,
];

export default {
  DEFAULT_TIMER,
  STATUS_POLL_READY,
  TASK_STATE,
};
