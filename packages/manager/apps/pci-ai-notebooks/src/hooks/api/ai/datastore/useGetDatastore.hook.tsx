import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { getDatastore } from '@/data/api/ai/datastore.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetDatastore(
  projectId: string,
  region: string,
  alias: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'data', 'region', region, 'alias', alias];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getDatastore({ projectId, region, alias }),
    ...options,
  }) as UseQueryResult<ai.DataStore, Error>;
}
