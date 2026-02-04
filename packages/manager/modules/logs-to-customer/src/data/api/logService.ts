import { apiClient, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import { Service } from '@/data/types/dbaas/logs/Logs.type';

/**
 * LIST log services infos
 */
export const getLogServices = async () => {
  const { data } = await fetchIcebergV6<Service>({
    route: `/dbaas/logs`,
    disableCache: true,
  });
  return data;
};

/**
 * GET log service infos
 */
export const getLogService = async (serviceName: string): Promise<Service> => {
  const { data } = await apiClient.v6.get<Service>(`/dbaas/logs/${serviceName}`);
  return data;
};
