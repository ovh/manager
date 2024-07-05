import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

type TRegionService = {
  endpoint: string;
  name: string;
  status: string;
};

export type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
  ipCountries: string[];
  services: TRegionService[];
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export const useProjectLocalRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions', 'local'],
    queryFn: () => getProjectRegions(projectId),
    select: (regions) =>
      regions.filter(({ type = [] }) => type === 'localzone'),
  });

export const useProjectNonLocalRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions', 'non-local'],
    queryFn: () => getProjectRegions(projectId),
    select: (regions) =>
      regions.filter(({ type = [] }) => type !== 'localzone'),
  });
