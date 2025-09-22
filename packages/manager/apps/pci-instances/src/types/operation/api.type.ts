/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
type OperationDtoStatus =
  | 'completed'
  | 'created'
  | 'in-error'
  | 'in-progress'
  | 'unknown'
  | string;

export type TOperationDto = {
  id: string;
  action: string;
  status: OperationDtoStatus;
  resourceId: string;
  subOperations?: {
    action: string;
    status: OperationDtoStatus;
  }[];
};
