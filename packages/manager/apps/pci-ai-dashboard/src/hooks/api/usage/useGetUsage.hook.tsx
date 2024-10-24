import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getCurrentUsage } from '@/data/api/usage/usage.api';
import * as usage from '@/types/cloud/usage';
import { useQueryImmediateRefetch } from '../useImmediateRefetch.hook';

export function useGetCurrentUsage(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'usage', 'current'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCurrentUsage({ projectId }),
    ...options,
  }) as UseQueryResult<usage.UsageCurrent, Error>;
}
