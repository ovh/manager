import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { getApps } from '@/data/api/apiApp';
import { ai } from '@/types/ai';

export function useGetApps(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'app'];
  return useQuery({
    queryKey,
    queryFn: () => getApps({ projectId }),
    ...options,
  }) as UseQueryResult<ai.app.App[], Error>;
}
