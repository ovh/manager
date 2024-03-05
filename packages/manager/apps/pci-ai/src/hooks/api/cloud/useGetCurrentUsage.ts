import { cloudApi } from '@/data/cloudapi';
import { usage } from '@/models/usage';
import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
 
  export function useGetCurrentUsage(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'usage/current'];
    return useQuery({
      queryKey,
      queryFn: () => cloudApi.getCurrentUsage(projectId),
      ...options,
    }) as UseQueryResult<usage.UsageCurrent, Error>;
  }