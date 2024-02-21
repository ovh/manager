import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { aiApi } from '@/data/aiapi';
  import { user } from '@/models/types';
  
  export function useGetUsers(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, '/user'];
    return useQuery({
      queryKey,
      queryFn: () => aiApi.getUsers(projectId),
      ...options,
    }) as UseQueryResult<user.User[], Error>;
  }