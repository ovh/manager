import { apiClient } from '@ovh-ux/manager-core-api';

import { Url } from '@/data/types/dbaas/logs/Logs.type';

/**
 * GET log stream url
 */
export const getLogStreamUrl = async (serviceName: string, streamId: string): Promise<Url[]> => {
  const { data } = await apiClient.v6.get<Url[]>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/url`,
  );
  return data;
};
