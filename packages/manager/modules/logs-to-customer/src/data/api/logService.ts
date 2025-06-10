import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { Service } from '../types/dbaas/logs';

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
export const getLogService = async (serviceName: string) =>
  v6.get<Service>(`/dbaas/logs/${serviceName}`);
