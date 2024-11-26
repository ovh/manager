import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { getTokens } from '@/data/api/ai/token.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import * as ai from '@/types/cloud/project/ai';

export function useGetTokens(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'token'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getTokens({ projectId }),
    ...options,
  }) as UseQueryResult<ai.token.Token[], Error>;
}
