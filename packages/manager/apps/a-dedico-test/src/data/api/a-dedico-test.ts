import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';


export type GetdedicatedServerListParams = {
  /** Filter resources on IAM tags */
  'iamTags': any;
};

export const getdedicatedServerListQueryKey = ['get/dedicated/server'];

/**
 * Operations about the DEDICATED service : List available services
 */
export const getdedicatedServerList = async (params: GetdedicatedServerListParams): Promise<any> =>
  apiClient.v6.get('/dedicated/server', { data: params });

export type GetdedicatedServerServiceParams = {
  /** The internal name of your dedicated server */
  'serviceName'?: any;
};

export const getdedicatedServerServiceQueryKey = (params: GetdedicatedServerServiceParams) => [`get/dedicated/server/${params.serviceName}`];

/**
 * Server informations : Get this object properties
 */
export const getdedicatedServerService = async (params: GetdedicatedServerServiceParams): Promise<any> =>
  apiClient.v6.get(`/dedicated/server/${params.serviceName}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({ pageSize, page }: { pageSize: number, page: number }) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/dedicated/server`,
    pageSize,
    page
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

