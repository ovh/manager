import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';

export type GetCloudProjectListParams = {
  /** Filter resources on IAM tags */
  iamTags: unknown;
};

export const getCloudProjectListQueryKey = ['get/cloud/project'];

/**
 * Operations about the PUBLICCLOUD service : List available services
 */
export const getCloudProjectList = async (params: GetCloudProjectListParams) =>
  apiClient.v6.get('/cloud/project', { data: params });
export type GetCloudProjectServiceParams = {
  /** Service name */
  serviceName?: string;
};

export const getCloudProjectServiceQueryKey = (
  params: GetCloudProjectServiceParams,
) => [`get/cloud/project/${params.serviceName}`];

/**
 * Operations about the PUBLICCLOUD service : Get this object properties
 */
export const getCloudProjectService = async (serviceName: string) =>
  apiClient.v6.get<TProject>(`/cloud/project/${serviceName}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  pageSize,
  page,
}: {
  projectId: string;
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/cloud/project`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
