import {
    useQueries,
} from '@tanstack/react-query';
import { aiApi } from '@/data/aiapi';
import { ai } from '@/models/types';
import { useCallback } from 'react';

export interface DataStoreWithRegion extends ai.DataStore {
    region: string;
}

export const useGetRegionsDatastoresWithReftch = (
    projectId: string,
    regions: ai.capabilities.Region[],
) => {
    const dataStoresQueries = useQueries({
        queries: regions
            ? regions.map(reg => {
                return {
                    queryKey: [projectId, 'ai/data/region', reg.id, 'alias'],
                    queryFn: () => aiApi.getDatastores(projectId, reg.id),
                    select: (datastore: ai.DataStore[]) => datastore.map((store: ai.DataStore) => ({ ...store, region: reg.id })),
                };
            })
            : [],
    })

    const refetchAll = useCallback(() => {
        dataStoresQueries.forEach(ds => ds.refetch());
    }, [dataStoresQueries]);

    const dataStoresWithRegion: DataStoreWithRegion[] = dataStoresQueries.flatMap(dataStore => {
        return dataStore.data?.map(ds => ({
            region: ds.region,
            alias: ds.alias,
            owner: ds.owner,
            type: ds.type,
        })) || [];
    }).filter(ds => ds.owner === ai.DataStoreOwnerEnum.customer);

    return {
        dataStoresWithRegion,
        refetchAll,
    };
}