export type TOperation = {
  id: string;
  action: string;
  progress: 0;
  resourceId: string;
  status: 'completed' | 'in-progress';
};
