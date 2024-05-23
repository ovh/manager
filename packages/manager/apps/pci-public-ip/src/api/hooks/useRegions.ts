import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

export interface Region {
  name: string;
  ipCountries: string[];
}

const getUrl = (projectId: string) => `/cloud/project/${projectId}/region`;

export const getRegions = async (projectId: string): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: getUrl(projectId),
  });
  return data as Region[];
};

export const getRegionsQuery = (projectId: string) => ({
  queryKey: [getUrl(projectId)],
  queryFn: () => getRegions(projectId),
});

export const useRegions = (projectId: string) =>
  useQuery(getRegionsQuery(projectId));
