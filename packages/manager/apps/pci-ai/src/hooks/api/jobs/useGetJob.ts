import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
  } from '@tanstack/react-query';
  import { jobsApi } from '@/data/aiapi';
  import { ai } from '@/models/types';
  
  export function useGetJob(
    projectId: string,
    jobId: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
  ) {
    const queryKey = [projectId, 'ai/job', jobId];
    return useQuery({
      queryKey,
      queryFn: () => jobsApi.getJob(projectId, jobId),
      ...options,
    }) as UseQueryResult<ai.job.Job, Error>;
  }
  