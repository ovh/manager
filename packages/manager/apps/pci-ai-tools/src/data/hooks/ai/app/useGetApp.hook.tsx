import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { getApp } from '@/data/api/ai/app/app.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetApp(
  projectId: string,
  appId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'app', appId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getApp({ projectId, appId }),
    ...options,
  }) as UseQueryResult<ai.app.App, AIError>;
}
