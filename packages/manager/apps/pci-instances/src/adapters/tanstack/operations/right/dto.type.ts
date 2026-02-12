export type TOperationStatusDTO =
  | 'canceled'
  | 'completed'
  | 'created'
  | 'in-error'
  | 'in-progress'
  | 'unknown';

export type TSubOperationDTO = {
  id: string;
  action: string;
  completedAt: string | null;
  progress: number;
  regions: string[];
  resourceId: string | null;
  startedAt: string | null;
  status: TOperationStatusDTO;
};

export type TOperationDTO = TSubOperationDTO & {
  createdAt: string;
  subOperations: TSubOperationDTO[] | null;
};
