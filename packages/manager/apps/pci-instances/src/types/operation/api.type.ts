/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type TOperationDto = {
  id: string;
  action: string;
  status:
    | 'completed'
    | 'created'
    | 'in-error'
    | 'in-progress'
    | 'unknown'
    | string;
  resourceId: string;
};
