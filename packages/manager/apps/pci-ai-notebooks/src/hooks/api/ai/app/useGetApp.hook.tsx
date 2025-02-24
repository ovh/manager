import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getApp } from '@/data/api/ai/app/app.api';

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
