import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { getApps } from '@/data/api/ai/app.api';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch.hook';

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
