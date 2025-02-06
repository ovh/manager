import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getLogs } from '@/data/api/ai/job/logs/logs.api';

export function useGetLogs(
  projectId: string,
  jobId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai/job', jobId, 'log'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getLogs({ projectId, jobId }),
    ...options,
  }) as UseQueryResult<ai.Logs, AIError>;
}
