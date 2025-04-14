import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetcloudProjectServiceParams = {
  /** Service name */
  serviceName?: any;
};

export const getcloudProjectServiceQueryKey = (
  params: GetcloudProjectServiceParams,
) => [`get/cloud/project/${params.serviceName}`];

/**
 * Operations about the PUBLICCLOUD service : Get this object properties
 */
export const getcloudProjectService = async (
  params: GetcloudProjectServiceParams,
): Promise<any> => apiClient.v6.get(`/cloud/project/${params.serviceName}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  projectId,
  pageSize,
  page,
}: {
  projectId: string;
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/cloud/project/${projectId}/aggregated/volumeBackup`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
