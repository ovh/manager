import { networkApi } from '@/data/api/network/network.api';
import { OptionsFor, useQueryImmediateRefetch } from '../useImmediateRefetch';

export function useGetSubnet(
  projectId: string,
  networkId: string,
  options?: OptionsFor<typeof networkApi.getSubnets>,
) {
  const queryKey = [projectId, 'network/private', networkId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => networkApi.getSubnets(projectId, networkId),
    ...options,
  });
}
