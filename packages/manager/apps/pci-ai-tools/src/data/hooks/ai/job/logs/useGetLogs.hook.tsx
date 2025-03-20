import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { getLogs } from '@/data/api/ai/job/logs/logs.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
