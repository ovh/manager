import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export interface Region {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
}

export const getProjectRegionsQueryKey = (projectId: string) => [
  'project',
  projectId,
  'regions',
];

export const getProjectRegions = async (
  projectId: string,
): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: getProjectRegionsQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
  });
