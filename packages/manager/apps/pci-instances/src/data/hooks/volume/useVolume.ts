import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TVolume } from '@/types/volume/common.type';
import { getVolumes } from '@/data/api/volume';

export const useVolumes = (
  projectId: string,
  region: string,
  options?: Omit<UseQueryOptions<TVolume[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'volume'],
    queryFn: () => getVolumes({ projectId, region }),
    ...options,
  });
