import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getAuthorization } from '@/data/api/ai/authorization.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetAuthorization(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'authorization'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getAuthorization({ projectId }),
    ...options,
  }) as UseQueryResult<ai.AuthorizationStatus, Error>;
}
