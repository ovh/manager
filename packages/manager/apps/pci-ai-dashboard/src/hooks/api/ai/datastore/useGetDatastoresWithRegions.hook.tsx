import { QueryObserverOptions, useQueries } from '@tanstack/react-query';
import { useCallback } from 'react';
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

  return {
    data: dataStoresWithRegion,
    refetchAll,
  };
};
