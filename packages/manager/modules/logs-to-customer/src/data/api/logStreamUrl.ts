import apiClient from '@ovh-ux/manager-core-api';
import { Url } from '../types/dbaas/logs';

/**
 * GET log stream url
 */
export const getLogStreamUrl = async (serviceName: string, streamId: string) =>
  apiClient.v6.get<Url[]>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/url`,
  );
