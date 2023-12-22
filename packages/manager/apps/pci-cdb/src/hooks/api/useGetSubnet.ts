import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/data/networkapi';
import { Subnet } from '@/models/vrack';

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
