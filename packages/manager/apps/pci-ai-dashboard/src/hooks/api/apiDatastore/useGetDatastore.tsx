import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getDatastore } from '@/data/api/apiDatastore';

export function useGetDatastore(
  projectId: string,
  region: string,
  alias: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'data', 'region', region, 'alias', alias];
  return useQuery({
    queryKey,
    queryFn: () => getDatastore({ projectId, region, alias }),
    ...options,
  }) as UseQueryResult<ai.DataStore, Error>;
}
