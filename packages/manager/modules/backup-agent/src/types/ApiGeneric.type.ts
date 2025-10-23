type ApiTaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

export type ApiTask = {
  id: string;
  link: string;
  status: ApiTaskStatus;
  type: string;
};
