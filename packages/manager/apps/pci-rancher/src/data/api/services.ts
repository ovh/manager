import { apiClient, fetchIcebergV2, v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovhcloud/manager-components';
import {
  CreateRancherPayload,
  PciProject,
  RancherPlan,
  RancherService,
  RancherVersion,
  TCatalog,
} from '@/api/api.type';

type RancherInfo = 'plan' | 'version';

export const getReferenceRancherInfo = (
  projectId: string,
  rancherInfo: RancherInfo,
) => `publicCloud/project/${projectId}/reference/rancher/${rancherInfo}`;

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
): Promise<RancherService> => {
  const response = await apiClient.v2.get(
    getByRancherIdProjectIdQueryKey(projectId, rancherId),
  );
  return response.data;
};

export const getProject = async (projectId: string): Promise<PciProject> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data;
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

export const getRancherPlan = async (projectId: string) =>
  apiClient.v2.get<RancherPlan[]>(getReferenceRancherInfo(projectId, 'plan'));

export const getRancherVersion = async (projectId: string) => {
  const response = await apiClient.v2.get<RancherVersion[]>(
    getReferenceRancherInfo(projectId, 'version'),
  );
  return response.data;
};

export const createRancherService = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateRancherPayload;
}) => {
  return apiClient.v2.post(getRancherByProjectIdQueryKey(projectId), {
    targetSpec: data,
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
      targetSpec: rancher.targetSpec,
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

export const getRancherVersionCapabilities = async (
  projectId: string,
  rancherId: string,
): Promise<RancherVersion[]> => {
  const response = await apiClient.v2.get(
    `${getByRancherIdProjectIdQueryKey(
      projectId,
      rancherId,
    )}/capabilities/version`,
  );
  return response.data;
};
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
export const getCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`;

export const getCatalog = async (ovhSubsidiary: string): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(getCatalogUrl(ovhSubsidiary));
  return data;
};

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: [getCatalogUrl(ovhSubsidiary)],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
