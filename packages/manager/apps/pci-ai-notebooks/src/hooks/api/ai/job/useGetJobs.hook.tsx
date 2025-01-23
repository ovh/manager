import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getJobs } from '@/data/api/ai/job/job.api';

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
