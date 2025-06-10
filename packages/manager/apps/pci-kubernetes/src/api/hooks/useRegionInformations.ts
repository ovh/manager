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
  regionName: string | null,
) =>
  useQuery<TRegionInformations | null>({
    queryKey: getRegionInfo(projectId, regionName as string),
    queryFn: () => getRegionInformations(projectId, regionName as string),
    enabled: !!projectId && !!regionName,
    retry: false,
  });
