import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getToken } from '@/data/api/ai/token/token.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetToken(
  projectId: string,
  tokenId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai/token', tokenId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getToken({ projectId, tokenId }),
    ...options,
  }) as UseQueryResult<ai.token.Token, Error>;
}
