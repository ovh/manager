import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

enum PciOperationStatus {
  Completed = 'completed',
  Created = 'created',
  InError = 'in-error',
  InProgress = 'in-progress',
  Unknown = 'unknown',
}

enum VrackTaskStatus {
  Cancelled = 'cancelled',
  Doing = 'doing',
  Done = 'done',
  Init = 'init',
  Todo = 'todo',
}

export type TVrack = {
  name: string;
  description: string;
  iam?: {
    id: string;
    displayName: string;
    tags: Record<string, string>;
    urn: string;
  };
};

export const pollOperation = async (
  projectId: string,
  operationId: string,
  intervalMs = 1000,
) => {
  const poll = async () => {
    const { data: op } = await v6.get(
      `/cloud/project/${projectId}/operation/${operationId}`,
    );
    if (op.status === PciOperationStatus.Completed) {
      return op;
    }
    if (op.status === PciOperationStatus.InError) {
      throw new Error(op);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    return poll();
  };
  return poll();
};

export const pollVrackTask = async (
  vrack: string,
  taskId: number,
  intervalMs = 1000,
) => {
  const poll = async () => {
    const { data: task } = await v6.get(`/vrack/${vrack}/task/${taskId}`);
    if (task.status === VrackTaskStatus.Done) {
      return task;
    }
    if (task.status === VrackTaskStatus.Cancelled) {
      throw new Error(task);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    return poll();
  };
  return poll();
};

export const getProjectVrack = async (projectId: string) => {
  const { data } = await v6.get<{
    id: string;
    name: string;
  }>(`/cloud/project/${projectId}/vrack`);
  return data;
};

export const getVracks = async (): Promise<TVrack[]> => {
  const { data } = await fetchIcebergV6<TVrack>({
    route: `/vrack`,
    disableCache: true,
  });
  return data;
};

export const createVrack = async (projectId: string) => {
  const { data } = await v6.post<{ id: string }>(
    `/cloud/project/${projectId}/vrack`,
  );
  return data;
};

export const associateVrack = async (
  serviceName: string,
  projectId: string,
) => {
  const { data } = await v6.post<{ id: number }>(
    `/vrack/${serviceName}/cloudProject`,
    {
      project: projectId,
    },
  );
  return data;
};
