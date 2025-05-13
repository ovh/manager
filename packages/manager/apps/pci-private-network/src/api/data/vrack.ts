import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export enum VrackTaskStatus {
  Cancelled = 'cancelled',
  Doing = 'doing',
  Done = 'done',
  Init = 'init',
  Todo = 'todo',
}

export type TVrackTask = {
  function: string;
  id: number;
  lastUpdate: string | null;
  orderId: number | null;
  serviceName: string | null;
  status: VrackTaskStatus;
  targetDomain: string | null;
  todoDate: string | null;
};

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

export const getVrackTask = async (vrack: string, taskId: string) => {
  try {
    const { data } = await v6.get<TVrackTask>(`/vrack/${vrack}/task/${taskId}`);
    return data;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
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
