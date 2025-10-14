import { networkApi } from '@/data/api/network/network.api';
import { OptionsFor, useQueryImmediateRefetch } from '../useImmediateRefetch';

export function useGetVrack(
  projectId: string,
  options?: OptionsFor<typeof networkApi.getVrack>,
) {
  const queryKey = [projectId, 'vrack'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => networkApi.getVrack(projectId),
    ...options,
  });
}
