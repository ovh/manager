import { useQuery } from '@tanstack/react-query';
import { getRegionInformations } from '../data/informations-region';
import { TRegionInformations } from '@/types/region';

export const getRegionInfo = (projectId: string, regionName: string) => [
  'region-informations',
  projectId,
  'region',
  regionName,
];

export const useRegionInformations = (projectId: string, regionName: string) =>
  useQuery<TRegionInformations>({
    queryKey: getRegionInfo(projectId, regionName),
    queryFn: () => getRegionInformations(projectId, regionName),
    enabled: !!projectId && !!regionName,
    retry: false,
  });
