import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  name: string;
  services: {
    name: string;
    status: string;
  }[];
};

export const getRegions = async (projectId: string): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};
