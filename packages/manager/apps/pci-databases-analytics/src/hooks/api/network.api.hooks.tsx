import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/api/network';
import { Network, Subnet, Vrack } from '@/models/network';

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

export function useGetSubnet(
  projectId: string,
  networkId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'network/private', networkId];
  return useQuery({
    queryKey,
    queryFn: () => networkApi.getSubnets(projectId, networkId),
    ...options,
  }) as UseQueryResult<Subnet[], Error>;
}

export function useGetVrack(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'vrack'];
  return useQuery({
    queryKey,
    queryFn: () => networkApi.getVrack(projectId),
    ...options,
  }) as UseQueryResult<Vrack, Error>;
}
