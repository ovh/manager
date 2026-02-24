export type TOperationStatus =
  | 'canceled'
  | 'completed'
  | 'created'
  | 'error'
  | 'pending'
  | 'unknown';

export type TBaseOperation = {
  id: string;
  action: string;
  status: TOperationStatus;
};

export type TOperation = TBaseOperation & {
  subOperations?: TBaseOperation[];
};
