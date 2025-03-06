import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getLogs } from '@/data/api/ai/app/logs/logs.api';

export function useGetLogs(
  projectId: string,
  appId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai/app', appId, 'log'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getLogs({ projectId, appId }),
    ...options,
  }) as UseQueryResult<ai.Logs, AIError>;
}
