import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';

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
  const context = useContext(ManagerReactComponentContext);
  const { iceberg } = context;

  const { data } = await iceberg.fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: getProjectRegionsQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
  });
