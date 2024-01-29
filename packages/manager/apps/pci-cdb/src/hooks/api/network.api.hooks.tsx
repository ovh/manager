import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/data/networkapi';
import { Network, Subnet } from '@/models/vrack';

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

export function useGetSubnet(
  projectId: string,
  networkId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'network/private', networkId];
  return useQuery({
    queryKey,
    queryFn: () => networkApi.getSubnets(projectId, networkId),
    ...options,
  }) as UseQueryResult<Subnet[], Error>;
}
