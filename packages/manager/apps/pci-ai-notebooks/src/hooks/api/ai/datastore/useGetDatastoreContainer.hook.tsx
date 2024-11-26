import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { getDatastoreContainer } from '@/data/api/ai/datastore.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { Containers } from '@/types/orderFunnel';

export function useGetDatastoreContainer(
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
    'containers',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getDatastoreContainer({ projectId, region, alias }),
    ...options,
  }) as UseQueryResult<Containers, Error>;
}
