import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch.hook';
import { getToken } from '@/data/api/ai/token.api';
import * as ai from '@/types/cloud/project/ai';

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
