import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getDatastoreAuth } from '@/data/api/ai/data/datastore.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getDatastoreAuth({ projectId, region, alias }),
    ...options,
  }) as UseQueryResult<ai.DataStoreAuth, Error>;
}
