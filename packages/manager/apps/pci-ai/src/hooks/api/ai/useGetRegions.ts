import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { aiApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetRegions(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, '/capabilities/region'];
    return useQuery({
      queryKey,
      queryFn: () => aiApi.getRegions(projectId),
      ...options,
    }) as UseQueryResult<ai.capabilities.Region[], Error>;
  }
  