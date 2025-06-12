import {
  fetchIcebergV6,
  apiClient,
  ApiResponse,
} from '@ovh-ux/manager-core-api';
import { DedicatedServer } from '../types/server.type';

export const getdedicatedServerListQueryKey = ['get/dedicated/server'];

/**
 * Operations about the DEDICATED service : List available services
 */
export const getdedicatedServers = async (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get('/dedicated/server');

/**
 *  Get list of dedicated servers with iceberg
 */

export const getDedicatedServerList = async ({
  pageSize,
  page,
}: {
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6<DedicatedServer>({
    route: `/dedicated/server`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
