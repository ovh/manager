import { QueryObserverOptions, useQueries } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import {
  getDatastoreContainer,
  getDatastores,
} from '@/data/api/ai/datastore.api';
import * as ai from '@/types/cloud/project/ai';
import { Containers } from '@/types/orderFunnel';

export interface DataStoresWithContainers extends ai.DataStore {
  container?: string;
  id: string;
}

export const useGetDatastoresWithContainers = (
  projectId: string,
  region: string,
  datastores: ai.DataStore[],
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) => {
  const containersQueries = useQueries({
    queries: datastores
      ? datastores
          // filter on type because git datastore does not have container
          .filter((ds) => ds.type !== ai.DataStoreTypeEnum.git)
          .map((ds) => {
            return {
              queryKey: [
                projectId,
                'ai/data/region',
                region,
                'alias',
                ds.alias,
                'containers',
              ],
              queryFn: () =>
                getDatastoreContainer({
                  projectId,
                  region,
                  alias: ds.alias,
                }),
              ...options,
              select: (container: Containers) =>
                container.containers.map((ct: string) => ({
                  id: `${ds.type} - ${ds.alias} - ${ct}`,
                  container: ct,
                  alias: ds.alias,
                  type: ds.type,
                  endpoint: ds.endpoint,
                  owner: ds.owner,
                })),
            };
          })
      : [],
  });

  const refetchAll = useCallback(() => {
    containersQueries.forEach((ds) => ds.refetch());
  }, [containersQueries]);

  const dataStoresWithContainers: DataStoresWithContainers[] = containersQueries.flatMap(
    (container) => {
      return container.data || [];
    },
  );

  // Add git datastore to the final object
  datastores
    ?.filter((ds) => ds.type === ai.DataStoreTypeEnum.git)
    ?.forEach((gitDs) => {
      const gitwithContainer: DataStoresWithContainers = {
        id: `${gitDs.type} - ${gitDs.alias}`,
        ...gitDs,
      };
      dataStoresWithContainers.push(gitwithContainer);
    });

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
    data: dataStoresWithContainers,
    refetchAll,
  };
};
