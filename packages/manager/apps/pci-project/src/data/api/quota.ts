import { v6 } from '@ovh-ux/manager-core-api';
import { Quota } from '../types/quota.type';

export const getQuotas = async (projectId: string): Promise<Quota[]> => {
  const { data } = await v6.get<Quota[]>(`/cloud/project/${projectId}/quota`);

  return data;
};
