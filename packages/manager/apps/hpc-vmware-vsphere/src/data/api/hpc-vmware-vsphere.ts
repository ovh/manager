import {
  fetchIcebergV6,
  apiClient,
  ApiResponse,
} from '@ovh-ux/manager-core-api';
import { TVMwareVSphere } from '@/types/vsphere';

export type GetDedicatedCloudListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getDedicatedCloudListQueryKey = ['get/dedicatedCloud'];

/**
 * Operations about the PCC service : List VMware on OVHcloud infrastructures
 */
export const getDedicatedCloudList = async (
  params: GetDedicatedCloudListParams,
): Promise<ApiResponse<TVMwareVSphere[]>> =>
  apiClient.v6.get<TVMwareVSphere[]>('/dedicatedCloud', { data: params });

export type GetDedicatedCloudServiceParams = {
  /** Domain of the service */
  serviceName?: string;
  signal?: AbortSignal;
};

export const getDedicatedCloudServiceQueryKey = (
  params: GetDedicatedCloudServiceParams,
) => [getDedicatedCloudListQueryKey[0], params.serviceName];

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getDedicatedCloudService = async ({
  serviceName,
  signal,
}: GetDedicatedCloudServiceParams): Promise<ApiResponse<TVMwareVSphere>> =>
  apiClient.v6.get<TVMwareVSphere>(`/dedicatedCloud/${serviceName}`, {
    signal,
  });

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
