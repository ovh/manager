import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { getJob } from '@/data/api/ai/job/job.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetJob(
  projectId: string,
  jobId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'job', jobId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getJob({ projectId, jobId }),
    ...options,
  }) as UseQueryResult<ai.job.Job, AIError>;
}
