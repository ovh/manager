import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { networkApi } from '@/data/api/network/network.api';
import { Vrack } from '@/interfaces/network';

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
