import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-pci-common';

import { TLocation } from '@/types/region';

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
