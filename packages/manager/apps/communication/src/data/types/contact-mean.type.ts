export type ContactMeanType = 'EMAIL';
export type ContactMeanStatus = 'DISABLED' | 'ERROR' | 'VALID' | 'TO_VALIDATE';
export type ContactMeanTaskStatus =
  | 'ERROR'
  | 'PENDING'
  | 'RUNNING'
  | 'SCHEDULED'
  | 'WAITING_USER_INPUT';

export type ContactMeanTask = {
  id: string;
  link: string;
  status: ContactMeanTaskStatus | null;
  type: string;
};

export type ContactMean = {
  createdAt: string;
  currentTasks: ContactMeanTask[];
  default: boolean;
  description: string | null;
  email: string | null;
  error: string | null;
  id: string;
  status: ContactMeanStatus;
  type: ContactMeanType;
};
