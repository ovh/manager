import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getNetworks } from '@/data/api/network';
import { TNetwork } from '@/types/network/entity.type';

export const useNetworks = (
  projectId: string,
  region: string,
  options?: Omit<UseQueryOptions<TNetwork[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'network'],
    queryFn: () => getNetworks({ projectId, region }),
    ...options,
  });
