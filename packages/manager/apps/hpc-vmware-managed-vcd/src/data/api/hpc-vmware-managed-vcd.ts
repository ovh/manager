import {
  ApiResponse,
  IcebergFetchParamsV2,
  apiClient,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import IVcdOrganization from '@/types/vcd-organization.interface';

export type GetVcdOrganizationListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getVcdProjectListQueryKey = [
  'get/vmwareCloudDirector/organization',
];

/**
 * Operations about the VCD service : List VMware cloud director organizations on OVHcloud infrastructures
 */
export const getVcdOrganizationList = async (
  params: GetVcdOrganizationListParams,
): Promise<{ data: IVcdOrganization[] }> =>
  apiClient.v2.get('/vmwareCloudDirector/organization', { data: params });

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getVcdOrganization = async (
  id: string,
): Promise<ApiResponse<IVcdOrganization>> =>
  apiClient.v2.get(`/vmwareCloudDirector/organization/${id}`);

/**
 *  Get listing with iceberg V2
 */
export const getListingIcebergV2 = async ({
  pageSize,
  cursor,
  route,
}: IcebergFetchParamsV2) => {
  const { data, status, cursorNext } = await fetchIcebergV2({
    route,
    pageSize,
    cursor,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};
