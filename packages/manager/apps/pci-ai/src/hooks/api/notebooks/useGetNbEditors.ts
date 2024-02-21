import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { notebookApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetNbCapaEditor(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, '/capabilities/editor'];
    return useQuery({
      queryKey,
      queryFn: () => notebookApi.getNbCapaEditors(projectId),
      ...options,
    }) as UseQueryResult<ai.notebook.Editor[], Error>;
  }
  