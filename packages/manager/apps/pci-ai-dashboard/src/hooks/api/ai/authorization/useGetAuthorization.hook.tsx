import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { getAuthorization } from '@/data/api/ai/authorization.api';

export function useGetAuthorization(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'authorization'];
  return useQuery({
    queryKey,
    queryFn: () => getAuthorization({ projectId }),
    ...options,
  }) as UseQueryResult<boolean, Error>;
}
