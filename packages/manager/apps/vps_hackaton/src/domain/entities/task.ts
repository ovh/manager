export type TTaskState = 'doing' | 'done' | 'error' | 'cancelled' | 'todo';

export type TTaskType =
  | 'reboot'
  | 'stop'
  | 'start'
  | 'reinstall'
  | 'snapshot'
  | 'restore'
  | 'migrate'
  | 'rescueMode';

export type TTask = {
  id: number;
  type: TTaskType;
  state: TTaskState;
  progress: number;
  startDate: string;
  endDate: string | null;
  comment: string | null;
};
