import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getTokens } from '@/data/api/ai/token/token.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
