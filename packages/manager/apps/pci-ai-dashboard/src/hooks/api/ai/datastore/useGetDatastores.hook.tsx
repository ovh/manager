import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { getDatastores } from '@/data/api/ai/datastore.api';

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
