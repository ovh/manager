export type TOperationStatusDTO =
  | 'canceled'
  | 'completed'
  | 'created'
  | 'in-error'
  | 'in-progress'
  | 'unknown';

export type TOperationDTO = {
  action: string;
  completedAt: string | null;
  id: string;
  progress: number;
  regions: string[];
  resourceId: string | null;
  startedAt: string | null;
  status: TOperationStatusDTO;
};
