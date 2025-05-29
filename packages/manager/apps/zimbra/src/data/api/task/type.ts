export const TaskStatus = {
  DONE: 'DONE',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SCHEDULED: 'SCHEDULED',
} as const;

export type TaskErrorMessage = {
  message: string;
};

export type TaskProgressStatus = {
  name: string;
  status: keyof typeof TaskStatus;
};

export type TaskType = {
  createdAt: string;
  errors: TaskErrorMessage[];
  finishedAt: string;
  id: string;
  link: string;
  message: string;
  progress: TaskProgressStatus[];
  startedAt: string;
  status: keyof typeof TaskStatus;
  type: string;
  updatedAt: string;
};
