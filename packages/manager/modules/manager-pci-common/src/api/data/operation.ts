import { v6 } from '@ovh-ux/manager-core-api';

export enum OperationStatus {
  Completed = 'completed',
  Created = 'created',
  InError = 'in-error',
  InProgress = 'in-progress',
  Unknown = 'unknown',
}

export type TOperation = {
  action: string;
  completedAt: string | null;
  createdAt: string;
  id: string;
  progress: number;
  regions: string[];
  resourceId: string | null;
  startedAt: string | null;
  status: OperationStatus;
};

export const getOperation = async (
  projectId: string,
  operationId: string,
): Promise<TOperation> => {
  try {
    const { data } = await v6.get<TOperation>(
      `/cloud/project/${projectId}/operation/${operationId}`,
    );
    return data;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
};
