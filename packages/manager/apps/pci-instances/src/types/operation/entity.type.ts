/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
type OperationStatus =
  | 'completed'
  | 'created'
  | 'in-error'
  | 'in-progress'
  | 'unknown'
  | string;

export type TOperation = {
  id: string;
  section: string;
  action: string;
  status:
    | 'completed'
    | 'created'
    | 'in-error'
    | 'in-progress'
    | 'unknown'
    | string;
  resourceId: string;
  subOperations?: {
    section: string;
    action: string;
    status: OperationStatus;
  }[];
};
