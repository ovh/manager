import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';

export type GetpublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: any;
};

export const getpublicCloudProjectProjectIdQueryKey = (
  params: GetpublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}`];

/**
 * Manage Public Cloud projects : Get details on a Public Cloud project
 */
export const getpublicCloudProjectProjectId = async (
  params: GetpublicCloudProjectProjectIdParams,
): Promise<any> => apiClient.v2.get(`/publicCloud/project/${params.projectId}`);
