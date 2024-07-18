import { TaskErrorMessage, TaskProgressStatus } from '../api.type';

export type TaskType = {
  createdAt: string;
  errors: TaskErrorMessage[];
  finishedAt: string;
  id: string;
  link: string;
  message: string;
  progress: TaskProgressStatus[];
  startedAt: string;
  status: string;
  type: string;
  updatedAt: string;
};
