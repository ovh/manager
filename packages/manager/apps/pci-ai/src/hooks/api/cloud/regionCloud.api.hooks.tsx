import { cloudApi } from '@/data/cloudapi';
import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
 
  export function useGetCloudRegions(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'region'];
    return useQuery({
      queryKey,
      queryFn: () => cloudApi.getRegions(projectId),
      ...options,
    }) as UseQueryResult<string[], Error>;
  }