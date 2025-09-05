import { networkApi } from '@/data/api/network/network.api';
import { OptionsFor, useQueryImmediateRefetch } from '../useImmediateRefetch';

export function useGetNetwork(
  projectId: string,
  options?: OptionsFor<typeof networkApi.getPrivateNetworks>,
) {
  const queryKey = [projectId, 'network/private'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => networkApi.getPrivateNetworks(projectId),
    ...options,
  });
}
