import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getDatastoreAuth } from '@/data/api/apiDatastore';

export function useGetDatastoreAuth(
  projectId: string,
  region: string,
  alias: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'ai',
    'data',
    'region',
    region,
    'alias',
    alias,
    'auth',
  ];
  return useQuery({
    queryKey,
    queryFn: () => getDatastoreAuth({ projectId, region, alias }),
    ...options,
  }) as UseQueryResult<ai.DataStoreAuth, Error>;
}
