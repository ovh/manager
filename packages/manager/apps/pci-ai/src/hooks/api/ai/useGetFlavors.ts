import {
    QueryObserverOptions,
    UseQueryResult,
    useQueries,
    useQuery,
} from '@tanstack/react-query';
import { aiApi } from '@/data/aiapi';
import { ai } from '@/models/types';
import { useCallback } from 'react';

export interface FlavorWithRegion extends ai.capabilities.Flavor {
    region: string;
}

export function useGetFlavors (
    projectId: string,
    region: string,
    options: Omit<QueryObserverOptions, 'queryKey'> = {}
) {
    const queryKey = [projectId, region, '/flavor'];
    return useQuery({
        queryKey,
        queryFn: () => aiApi.getFlavors(projectId, region),
        ...options,
    }) as UseQueryResult<ai.capabilities.Flavor[], Error>;
}


export const useGetFlavorsWithRegionsAndReftch = (
    projectId: string,
    regions: ai.capabilities.Region[],
) => {
    const flavorsQueries = useQueries({
        queries: regions
            ? regions.map(reg => {
                return {
                    queryKey: [projectId, 'ai/capabilities/region', reg.id, 'flavor'],
                    queryFn: () => aiApi.getFlavors(projectId, reg.id),
                    select: (flavor: ai.capabilities.Flavor[]) => flavor.map((flav: ai.capabilities.Flavor) => ({ ...flav, region: reg.id })),
                };
            })
            : [],
    })

    const refetchAll = useCallback(() => {
        flavorsQueries.forEach(flav => flav.refetch());
    }, [flavorsQueries]);

    const flavorsWithRegion: FlavorWithRegion[] = flavorsQueries.flatMap(flavor => {
        return flavor.data?.map(ds => ({
            default: ds.default,
            description: ds.description,
            gpuInformation: ds.gpuInformation,
            id: ds.id,
            max: ds.max,
            resourcesPerUnit: ds.resourcesPerUnit,
            type: ds.type,
            region: ds.region,
        })) || [];
    })

    return {
        flavorsWithRegion,
        refetchAll,
    };
}