import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { networkApi } from '@/data/api/network/network.api';
import { Vrack } from '@/types/cloud/Vrack';
import { useQueryImmediateRefetch } from '../useImmediateRefetch';

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
