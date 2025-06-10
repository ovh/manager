import { useQuery } from '@tanstack/react-query';
import { getRegionInformations } from '../data/informations-region';
import { TRegionInformations } from '@/types/region';

export const getRegionInfo = (projectId: string, regionName: string) => [
  'region-informations',
  projectId,
  'region',
  regionName,
];

export const useRegionInformations = (
  projectId: string,
  regionName: string | null = null,
) =>
  useQuery<TRegionInformations | null>({
    queryKey: regionName ? getRegionInfo(projectId, regionName) : [],
    queryFn: () =>
      regionName ? getRegionInformations(projectId, regionName) : null,
    enabled: !!projectId && !!regionName,
    retry: false,
  });
