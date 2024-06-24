/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';

export type GetPublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: any;
};

export const getPublicCloudProjectProjectIdQueryKey = (
  params: GetPublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}`];

/**
 * Manage Public Cloud projects : Get details on a Public Cloud project
 */
export const getPublicCloudProjectProjectId = async (
  params: GetPublicCloudProjectProjectIdParams,
): Promise<any> => apiClient.v2.get(`/publicCloud/project/${params.projectId}`);

/**
 *  Get listing with iceberg V2
 */

export const getListingIcebergV2 = async ({
  projectId,
  pageSize,
  cursor,
}: {
  projectId: string;
  pageSize: number;
  cursor?: string;
}) => {
  const { data, status, cursorNext } = await fetchIcebergV2({
    route: `/publicCloud/project/${projectId}/saving-plan`,
    pageSize,
    cursor,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};
