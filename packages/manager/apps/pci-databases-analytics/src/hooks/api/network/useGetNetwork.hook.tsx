import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { networkApi } from '@/data/api/network/network.api';
import { Network } from '@/types/cloud/network';
import { useQueryImmediateRefetch } from '../useImmediateRefetch';

export function useGetNetwork(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'network/private'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => networkApi.getPrivateNetworks(projectId),
    ...options,
  }) as UseQueryResult<Network[], Error>;
}
