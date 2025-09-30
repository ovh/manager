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
  section: 'instance' | string;
  action: 'create' | 'reinstall' | string;
  status:
    | 'completed'
    | 'created'
    | 'in-error'
    | 'in-progress'
    | 'unknown'
    | string;
  resourceId: string;
  subOperations?: {
    section: 'image' | string;
    action: 'copytoregion' | string;
    status: OperationStatus;
  }[];
};
