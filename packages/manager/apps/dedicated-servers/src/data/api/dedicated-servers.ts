import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { DedicatedServer } from '../types/server.type';

export type GetdedicatedServerListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getdedicatedServerListQueryKey = ['get/dedicated/server'];

/**
 * Operations about the DEDICATED service : List available services
 */
export const getdedicatedServerList = async (
  params?: GetdedicatedServerListParams,
): Promise<any> => apiClient.v6.get('/dedicated/server', params && { data: params });

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
