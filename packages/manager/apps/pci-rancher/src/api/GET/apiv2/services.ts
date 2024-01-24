import {
  apiClient,
  fetchIceberg,
  IcebergFetchResult,
} from '@ovh-ux/manager-core-api';
import { PciProject, RancherService } from '../../api.type';

const getByRancherIdProjectIdQueryKey = (
  projectId: string,
  rancherId: string,
) => `/publicCloud/project/${projectId}/rancher/${rancherId}`;

export const getRancherProjectById = async (
  projectId?: string,
): Promise<IcebergFetchResult<RancherService>> =>
  apiClient.v2.get(`/publicCloud/project/${projectId}/rancher`);

export const getByRancherIdProjectId = async (
  projectId?: string,
  rancherId?: string,
): Promise<{ data: RancherService }> =>
  apiClient.v2.get(getByRancherIdProjectIdQueryKey(projectId, rancherId));

export const getProject = async (projectId: string): Promise<PciProject> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data as PciProject;
};

export const deleteRancherServiceQueryKey = (rancherId: string) => [
  'delete/rancher/resource',
  rancherId,
];

export const patchRancherServiceQueryKey = (rancherId: string) => [
  'patch/rancher/resource',
  rancherId,
];

export const deleteRancherService = async ({
  rancherId,
  projectId,
}: {
  rancherId: string;
  projectId: string;
}) => {
  return apiClient.v2.delete(
    getByRancherIdProjectIdQueryKey(projectId, rancherId),
  );
};

export const editRancherService = async ({
  rancherId,
  projectId,
  rancher,
}: {
  rancherId: string;
  projectId: string;
  rancher: Partial<RancherService>;
}) => {
  return apiClient.v2.put(
    getByRancherIdProjectIdQueryKey(projectId, rancherId),
    {
      targetSpec: {
        ...rancher.targetSpec,
        name: 'rancher1_renamed',
      },
    },
  );
};

export type GetpublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: string;
};

export const getpublicCloudProjectProjectIdQueryKey = (
  params: GetpublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}/rancher`];

export const getpublicCloudReferenceRancherVersionListQueryKey = [
  'get/publicCloud/reference/rancher/version',
];

/**
 *  Get listing with iceberg
 */
export const getListingIceberg = async () => {
  try {
    const List = await fetchIceberg({
      route: '/publicCloud/project',
      apiVersion: 'v2',
    }).then(({ data, status }: any) => ({ data, status }));
    return List;
  } catch (error) {
    return Promise.reject(error);
  }
};
