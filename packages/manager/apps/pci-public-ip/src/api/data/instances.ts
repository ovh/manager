import { v6 } from '@ovh-ux/manager-core-api';
import { TInstance } from '@/api/types';

export const getInstancesUrl = (projectId: string) =>
  `/cloud/project/${projectId}/instance`;

export const getInstances = async (projectId: string): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(getInstancesUrl(projectId));
  return data;
};
