import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { ai } from '@/models/types';
  import { jobsApi } from '@/data/aiapi';
  
  export function useGetJobLogs(
    projectId: string,
    jobId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, jobId, 'logs'];
    return useQuery({
      queryKey,
      queryFn: () => jobsApi.getLogs(projectId, jobId),
      ...options,
    }) as UseQueryResult<ai.Logs, Error>;
  }
  