export type TOperationStatus =
  | 'canceled'
  | 'completed'
  | 'created'
  | 'error'
  | 'pending'
  | 'unknown';

export type TInstanceCreationData = {
  operationId: string | null;
  status: TOperationStatus;
};
