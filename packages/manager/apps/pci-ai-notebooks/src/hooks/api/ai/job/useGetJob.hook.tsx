import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getJob } from '@/data/api/ai/job/job.api';

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
