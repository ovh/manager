import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { notebookApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetNbCapaFrameworks(
    projectId: string,
    options: QueryObserverOptions = {},
  ) {
    const queryKey = [projectId, '/capabilities/framework'];
    return useQuery({
      queryKey,
      queryFn: () => notebookApi.getNbCapaFrameworks(projectId),
      ...options,
    }) as UseQueryResult<ai.notebook.Framework[], Error>;
  }
  