export enum TaskStatus {
  DONE = 'DONE',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
}

export type TaskErrorMessage = {
  message: string;
};

export type TaskProgressStatus = {
  name: string;
  status: TaskStatus;
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
  status: TaskStatus;
  type: string;
  updatedAt: string;
};
