import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { jobsApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetJobs(
    projectId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/jobs'];
    return useQuery({
      queryKey,
      queryFn: () => jobsApi.getJobs(projectId),
      ...options,
    }) as UseQueryResult<ai.job.Job[], Error>;
  }
  