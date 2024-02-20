import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { aiApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetTokens(
    projectId: string,
    options: QueryObserverOptions = {},
  ) {
    const queryKey = [projectId, '/token'];
    return useQuery({
      queryKey,
      queryFn: () => aiApi.getTokens(projectId),
      ...options,
    }) as UseQueryResult<ai.token.Token[], Error>;
  }
  