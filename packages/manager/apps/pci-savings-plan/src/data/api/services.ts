import { v6 } from '@ovh-ux/manager-core-api';

export const getServices = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`services?resourceName=${projectId}`);
  return data;
};
