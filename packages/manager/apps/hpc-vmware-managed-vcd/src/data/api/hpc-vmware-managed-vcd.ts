import {
  ApiResponse,
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

export type GetVcdOrganizationParams = {
  id?: string;
};

export const getVcdOrganizationQueryKey = ({
  id,
}: GetVcdOrganizationParams) => [`get/vmwareCloudDirector/organization/${id}`];

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getVcdOrganization = async ({
  id,
}: GetVcdOrganizationParams): Promise<ApiResponse<IVcdOrganization>> =>
  apiClient.v2.get(`/vmwareCloudDirector/organization/${id}`);

/**
 *  Get listing with iceberg V2
 */
export const getListingIcebergV2 = async ({
  pageSize,
  cursor,
}: {
  pageSize: number;
  cursor: string;
}) => {
  const { data, status, cursorNext } = await fetchIcebergV2({
    route: `/vmwareCloudDirector/organization`,
    pageSize,
    cursor,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};
