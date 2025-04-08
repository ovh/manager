import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetdedicatedCloudListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getdedicatedCloudListQueryKey = ['get/dedicatedCloud'];

/**
 * Operations about the PCC service : List VMware on OVHcloud infrastructures
 */
export const getdedicatedCloudList = async (
  params: GetdedicatedCloudListParams,
): Promise<any> => apiClient.v6.get('/dedicatedCloud', { data: params });

export type GetdedicatedCloudServiceParams = {
  /** Domain of the service */
  serviceName?: string;
};

export const getdedicatedCloudServiceQueryKey = (
  params: GetdedicatedCloudServiceParams,
) => [getdedicatedCloudListQueryKey[0], params.serviceName];

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getdedicatedCloudService = async (
  params: GetdedicatedCloudServiceParams,
): Promise<any> => apiClient.v6.get(`/dedicatedCloud/${params.serviceName}`);

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
    route: `/dedicatedCloud`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
