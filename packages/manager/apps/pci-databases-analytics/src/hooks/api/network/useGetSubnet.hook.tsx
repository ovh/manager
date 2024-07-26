import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { networkApi } from '@/data/api/network/network.api';
import { Subnet } from '@/types/cloud/network';
import { useQueryImmediateRefetch } from '../useImmediateRefetch';

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
