import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { networkApi } from '@/api/network';
import { Network, Subnet, Vrack } from '@/models/network';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

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

export function useGetSubnet(
  projectId: string,
  networkId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'network/private', networkId];
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => networkApi.getVrack(projectId),
    ...options,
  }) as UseQueryResult<Vrack, Error>;
}
