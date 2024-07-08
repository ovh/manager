import { apiClient, fetchIcebergV2 } from '@ovh-ux/manager-core-api';

export type GetVcdProjectListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getVcdProjectListQueryKey = [
  'get/vmwareCloudDirector/organization',
];

/**
 * Operations about the VCD service : List VMware cloud director projects on OVHcloud infrastructures
 */
export const getVcdProjectList = async (
  params: GetVcdProjectListParams,
): Promise<any> =>
  apiClient.V2.get('/vmwareCloudDirector/organization', { data: params });

export type GetVcdProjectServiceParams = {
  /** service name = project name */
  serviceName?: any;
};

export const getVcdOrganizationServiceQueryKey = (
  params: GetVcdProjectServiceParams,
) => [`get/vmwareCloudDirector/organization/${params.serviceName}`];

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getVcdOrganizationService = async (
  params: GetVcdProjectServiceParams,
): Promise<any> =>
  apiClient.V2.get(`/vmwareCloudDirector/organization/${params.serviceName}`);

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
