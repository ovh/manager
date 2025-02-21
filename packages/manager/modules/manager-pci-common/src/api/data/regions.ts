import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  name: string;
  type: string;
  status: string;
  continentCode: string;
  services: {
    name: string;
    status: string;
    endpoint: string;
  }[];
  datacenterLocation: string;
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const addProjectRegion = async (
  projectId: string,
  region: string,
): Promise<void> => {
  const { data } = await v6.post<void>(`/cloud/project/${projectId}/region`, {
    region,
  });
  return data;
};
