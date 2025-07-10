import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getNetwork } from '@/data/api/network';
import { TNetwork } from '@/types/network/entity.type';
import { instancesQueryKey } from '@/utils';

export const useNetwork = (
  projectId: string,
  region: string,
  options?: Omit<UseQueryOptions<TNetwork[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: instancesQueryKey(projectId, ['region', region, 'network']),
    queryFn: () => getNetwork({ projectId, region }),
    ...options,
  });
