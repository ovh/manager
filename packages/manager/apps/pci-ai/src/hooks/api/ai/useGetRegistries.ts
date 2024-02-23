import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { aiApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetRegistries(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, '/ai/regustry'];
    return useQuery({
      queryKey,
      queryFn: () => aiApi.getRegistries(projectId),
      ...options,
    }) as UseQueryResult<ai.registry.Registry[], Error>;
  }