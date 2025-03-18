import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getJobs } from '@/data/api/ai/job/job.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetJobs(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'job'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getJobs({ projectId }),
    ...options,
  }) as UseQueryResult<ai.job.Job[], Error>;
}
