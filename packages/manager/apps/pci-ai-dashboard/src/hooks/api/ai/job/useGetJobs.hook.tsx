import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { getJobs } from '@/data/api/ai/job.api';
import { ai } from '@/types/ai';

export function useGetJobs(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'job'];
  return useQuery({
    queryKey,
    queryFn: () => getJobs({ projectId }),
    ...options,
  }) as UseQueryResult<ai.job.Job[], Error>;
}
