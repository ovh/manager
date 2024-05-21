import { apiClient, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import {
  CreateRancherPayload,
  PciProject,
  RancherPlan,
  RancherService,
  RancherVersion,
} from '@/api/api.type';

type RancherInfo = 'plan' | 'version';

export const getReferenceRancherInfo = (rancherInfo: RancherInfo) =>
  `/publicCloud/reference/rancher/${rancherInfo}`;

const getRancherByProjectIdQueryKey = (projectId: string) =>
  `/publicCloud/project/${projectId}/rancher`;

const getByRancherIdProjectIdQueryKey = (
  projectId: string,
  rancherId: string,
) => `${getRancherByProjectIdQueryKey(projectId)}/${rancherId}`;

export const getRancherProjectById = async (
  projectId?: string,
): Promise<RancherService[]> => {
  const { data } = await apiClient.v2.get(
    `/publicCloud/project/${projectId}/rancher`,
  );
  return data;
};

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

export const postRancherServiceQueryKey = (rancherId: string) => [
  'post/rancher/resource',
  rancherId,
];

export const createRancherServiceQueryKey = () => ['post/rancher/resource'];

export const getRancherPlan = async () =>
  apiClient.v2.get<RancherPlan[]>(getReferenceRancherInfo('plan'));

export const getRancherVersion = async () =>
  apiClient.v2.get<RancherVersion[]>(getReferenceRancherInfo('version'));

export const createRancherService = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateRancherPayload;
}) => {
  return apiClient.v2.post(getRancherByProjectIdQueryKey(projectId), {
    ...data,
    ipRestrictions: [],
  });
};

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
        name: rancher.currentState.name,
      },
    },
  );
};

export const generateAccessRancherService = async ({
  rancherId,
  projectId,
}: {
  rancherId: string;
  projectId: string;
}) =>
  apiClient.v2.post(
    `${getByRancherIdProjectIdQueryKey(projectId, rancherId)}/adminCredentials`,
  );

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
    return fetchIcebergV2({
      route: '/publicCloud/project',
    }).then(({ data, status }) => ({ data, status }));
  } catch (error) {
    return Promise.reject(error);
  }
};
