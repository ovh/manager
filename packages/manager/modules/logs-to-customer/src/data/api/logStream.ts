import apiClient from '@ovh-ux/manager-core-api';
import { Stream } from '../types/dbaas/logs';

/**
 * GET log stream
 */
export const getLogStream = async (serviceName: string, streamId: string) =>
  apiClient.v6.get<Stream>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
  );
