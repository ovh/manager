import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

import { TKubeRegionsDTO } from '@/adapters/api/kubeRegions/dto.types';
import { mapKubeRegionsToEntity } from '@/adapters/api/kubeRegions/mapper';
import { TLocation, TRegion } from '@/types/region';

export const getProjectRegions = async (projectId: string): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const addProjectRegion = async (projectId: string, region: string): Promise<TLocation> => {
  const { data } = await v6.post<TLocation>(`/cloud/project/${projectId}/region`, {
    region,
  });
  return data;
};

export const getKubeRegions = async (projectId: string) => {
  const data = await v6
    .get<TKubeRegionsDTO>(`/cloud/project/${projectId}/capabilities/kube/regions`)
    .then(({ data }) => mapKubeRegionsToEntity(data));
  return data;
};
