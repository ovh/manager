import { apiClient } from '@ovh-ux/manager-core-api';

import { Service, Stream } from '@/data/types/dbaas/logs/Logs.type';

/**
 * GET log stream
 */
export const getLogStream = async (
  serviceName: Service['serviceName'],
  streamId: string,
): Promise<Stream> => {
  const { data } = await apiClient.v6.get<Stream>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
  );
  return data;
};
