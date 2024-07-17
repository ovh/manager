import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getTokens } from '@/data/api/ai/token.api';

export function useGetTokens(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'token'];
  return useQuery({
    queryKey,
    queryFn: () => getTokens({ projectId }),
    ...options,
  }) as UseQueryResult<ai.token.Token[], Error>;
}
