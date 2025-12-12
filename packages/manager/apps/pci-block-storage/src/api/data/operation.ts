import { v6 } from '@ovh-ux/manager-core-api';

export enum TOperationStatus {
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  CREATED = 'created',
  IN_ERROR = 'in-error',
  IN_PROGRESS = 'in-progress',
  UNKNOWN = 'unknown',
}

export type TOperation = {
  id: string;
  status: TOperationStatus;
};

export const getOperation = async (
  projectId: string,
  operationId: string,
): Promise<TOperation> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/operation/${operationId}`,
  );
  return data;
};
