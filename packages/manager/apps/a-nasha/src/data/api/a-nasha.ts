import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetdedicatedNashaListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getdedicatedNashaListQueryKey = ['get/dedicated/nasha'];

/**
 * Operations about the STORAGE service : List available services
 */
export const getdedicatedNashaList = async (
  params: GetdedicatedNashaListParams,
): Promise<any> => apiClient.v6.get('/dedicated/nasha', { data: params });

export type GetdedicatedNashaServiceParams = {
  /** The internal name of your storage */
  serviceName?: any;
};

export const getdedicatedNashaServiceQueryKey = (
  params: GetdedicatedNashaServiceParams,
) => [`get/dedicated/nasha/${params.serviceName}`];

/**
 * Storage nas HA : Get this object properties
 */
export const getdedicatedNashaService = async (
  params: GetdedicatedNashaServiceParams,
): Promise<any> => apiClient.v6.get(`/dedicated/nasha/${params.serviceName}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  pageSize,
  page,
}: {
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/dedicated/nasha`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

/**
 *  Get Service infos with iceberg V6
 */
export const getServiceInfos = async ({
  serviceName,
}: {
  serviceName: string;
}) => {
  const { data, status } = await apiClient.v6(
    `/dedicated/nasha/${serviceName}`,
  );
  if (status > 400) {
    throw new Error();
  }
  return { data, status };
};
