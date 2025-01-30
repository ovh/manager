import apiClient, { fetchIcebergV6, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { Service, Stream } from '../types/dbaas/logs';

/**
 * LIST log streams
 */
export const getLogStreams = async (
  serviceName: Service['serviceName'],
  pagination: PaginationState,
  filters: Filter[],
) => {
  const { data } = await fetchIcebergV6<Stream>({
    route: `/dbaas/logs/${serviceName}/output/graylog/stream`,
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters,
    disableCache: true,
  });
  return data;
};

/**
 * GET log stream
 */
export const getLogStream = async (
  serviceName: Service['serviceName'],
  streamId: string,
) =>
  apiClient.v6.get<Stream>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
  );
