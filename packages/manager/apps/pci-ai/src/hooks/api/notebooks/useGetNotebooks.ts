import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { notebookApi } from '@/data/aiapi';
  import { ai} from '@/models/types';
  
  export function useGetNotebooks(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/notebook'];
    return useQuery({
      queryKey,
      queryFn: () => notebookApi.getNotebooks(projectId),
      ...options,
    }) as UseQueryResult<ai.notebook.Notebook[], Error>;
  }
  