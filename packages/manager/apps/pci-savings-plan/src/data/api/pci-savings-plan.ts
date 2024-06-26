import { apiClient } from '@ovh-ux/manager-core-api';
import { PciProject } from './api.type';

export type GetPublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: string;
};

export const getPublicCloudProjectProjectIdQueryKey = (
  params: GetPublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}`];

/**
 * Manage Public Cloud projects : Get details on a Public Cloud project
 */
export const getPublicCloudProjectProjectId = async (
  params: GetPublicCloudProjectProjectIdParams,
): Promise<PciProject> => apiClient.v2.get(`/publicCloud/project/${params.projectId}`);

export const getProject = async (projectId: string): Promise<PciProject> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data;
};
