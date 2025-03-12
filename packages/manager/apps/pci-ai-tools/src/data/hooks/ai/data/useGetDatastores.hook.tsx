import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getDatastores } from '@/data/api/ai/data/datastore.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetDatastores(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'data', 'region', region, 'alias'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getDatastores({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.DataStore[], Error>;
}
