import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as usage from '@datatr-ux/ovhcloud-types/cloud/usage/index';
import { getCurrentUsage } from '@/data/api/usage/usage.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
