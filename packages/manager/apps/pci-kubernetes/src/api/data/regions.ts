import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

import { TRegionDTO } from '@/adapters/api/regions/dto.type';
import { mapRegionsToEntity } from '@/adapters/api/regions/mapper';
import { TRegions } from '@/domain/entities/regions';
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

export const getKubeRegions = async (projectId: string): Promise<string[]> => {
  const { data } = await v6.get<string[]>(`/cloud/project/${projectId}/capabilities/kube/regions`);
  return data;
};

export const getRegions = async (projectId: string): Promise<TRegions> => {
  const data = await fetchIcebergV6<TRegionDTO>({
    route: `/cloud/project/${projectId}/region`,
  }).then(({ data }) => mapRegionsToEntity(data));

  return data;
};
