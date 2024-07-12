import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export interface Region {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
}

export const getProjectRegions = async (
  projectId: string,
): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};
