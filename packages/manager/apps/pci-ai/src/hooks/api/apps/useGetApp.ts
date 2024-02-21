import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { appsApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetApp(
    projectId: string,
    appId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/app', appId];
    return useQuery({
      queryKey,
      queryFn: () => appsApi.getApp(projectId, appId),
      ...options,
    }) as UseQueryResult<ai.app.App, Error>;
  }
  