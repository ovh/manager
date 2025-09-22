import { useQuery } from '@tanstack/react-query';

import { TRegionInformations } from '@/types/region';

import { getRegionInformations } from '../data/informations-region';

export const getRegionInfo = (projectId: string, regionName: string) => [
  'region-informations',
  projectId,
  'region',
  regionName,
];

export const useRegionInformations = (projectId: string, regionName: string | null) =>
  useQuery<TRegionInformations | null>({
    queryKey: getRegionInfo(projectId, regionName),
    queryFn: () => getRegionInformations(projectId, regionName),
    enabled: !!projectId && !!regionName,
    retry: false,
  });
