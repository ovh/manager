import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getDatastores } from '@/data/api/apiDatastore';

export function useGetDatastores(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'data', 'region', region, 'alias'];
  return useQuery({
    queryKey,
    queryFn: () => getDatastores({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.DataStore[], Error>;
}