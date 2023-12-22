import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/data/networkapi';
import { Network } from '@/models/vrack';

export function useGetNetwork(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'network/private'];
  return useQuery({
    queryKey,
    queryFn: () => networkApi.getPrivateNetworks(projectId),
    ...options,
  }) as UseQueryResult<Network[], Error>;
}
