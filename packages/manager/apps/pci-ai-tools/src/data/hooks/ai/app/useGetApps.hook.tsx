import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getApps } from '@/data/api/ai/app/app.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetApps(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'app'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getApps({ projectId }),
    ...options,
  }) as UseQueryResult<ai.app.App[], Error>;
}
