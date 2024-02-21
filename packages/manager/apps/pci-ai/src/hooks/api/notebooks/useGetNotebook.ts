import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { notebookApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetNotebook(
    projectId: string,
    notebookId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/notebook', notebookId];
    return useQuery({
      queryKey,
      queryFn: () => notebookApi.getNotebook(projectId, notebookId),
      ...options,
    }) as UseQueryResult<ai.notebook.Notebook, Error>;
  }
  