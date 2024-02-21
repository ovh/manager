import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { appsApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetApps(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/apps'];
    return useQuery({
      queryKey,
      queryFn: () => appsApi.getApps(projectId),
      ...options,
    }) as UseQueryResult<ai.app.App[], Error>;
  }