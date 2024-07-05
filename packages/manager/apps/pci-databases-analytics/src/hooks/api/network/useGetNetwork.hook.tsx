import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/data/api/network/network.api';
import { Network } from '@/interfaces/network';

export function useGetNetwork(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'network/private'];
  return useQuery({
    queryKey,
    queryFn: () => networkApi.getPrivateNetworks(projectId),
    ...options,
  }) as UseQueryResult<Network[], Error>;
}
