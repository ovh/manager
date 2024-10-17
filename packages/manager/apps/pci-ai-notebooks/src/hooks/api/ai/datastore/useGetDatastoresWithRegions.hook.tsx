import { QueryObserverOptions, useQueries } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { getDatastores } from '@/data/api/ai/datastore.api';
import * as ai from '@/types/cloud/project/ai';

export interface DataStoresWithRegion extends ai.DataStore {
  region: string;
}

export const useGetDatastoresWithRegions = (
  projectId: string,
  regions: ai.capabilities.Region[],
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) => {
  const dataStoresQueries = useQueries({
    queries: regions
      ? regions.map((reg) => {
          return {
            queryKey: [projectId, 'ai/data/region', reg.id, 'alias'],
            queryFn: () => getDatastores({ projectId, region: reg.id }),
            ...options,
            select: (datastore: ai.DataStore[]) =>
              datastore.map((store: ai.DataStore) => ({
                ...store,
                region: reg.id,
              })),
          };
        })
      : [],
  });

  const refetchAll = useCallback(() => {
    dataStoresQueries.forEach((ds) => ds.refetch());
  }, [dataStoresQueries]);

  const dataStoresWithRegion: DataStoresWithRegion[] = dataStoresQueries
    .flatMap((dataStore) => {
      return (
        dataStore.data?.map((ds) => ({
          endpoint: ds.endpoint,
          region: ds.region,
          alias: ds.alias,
          owner: ds.owner,
          type: ds.type,
        })) || []
      );
    })
    .filter((ds) => ds.owner === ai.DataStoreOwnerEnum.customer);

  // refetch if pooling changes
  const prevRefetchInterval = useRef(options?.refetchInterval);
  useEffect(() => {
    if (
      options?.enabled !== false &&
      options.refetchInterval !== undefined &&
      options.refetchInterval !== prevRefetchInterval.current
    ) {
      refetchAll();
    }
    prevRefetchInterval.current = options.refetchInterval;
  }, [options.refetchInterval, options.enabled, refetchAll]);

  return {
    data: dataStoresWithRegion,
    refetchAll,
  };
};
