import { apiClient } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';

export type GetCloudProjectServiceParams = {
  serviceName?: string;
};

export const getCloudProjectListQueryKey = ['get/cloud/project'];

export const getCloudProjectServiceQueryKey = (
  params: GetCloudProjectServiceParams,
) => [`get/cloud/project/${params.serviceName}`];

/**
 * Operations about the PublicCloud service : Get this object properties
 */
export const getCloudProjectService = async (serviceName: string) =>
  apiClient.v6.get<TProject>(`/cloud/project/${serviceName}`);
