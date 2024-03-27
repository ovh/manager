import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getVrack } from '@/api/vrack';
import { Vrack } from '@/models/network';

export function useGetVrack(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'vrack'];
  return useQuery({
    queryKey,
    queryFn: () => getVrack(projectId),
    ...options,
  }) as UseQueryResult<Vrack, Error>;
}
