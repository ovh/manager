import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getDatastore } from '@/data/api/ai/data/datastore.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
