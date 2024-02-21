import {
    QueryObserverOptions,
    UseQueryResult,
    useQuery,
} from '@tanstack/react-query';
import { aiApi } from '@/data/aiapi';
import { ai } from '@/models/types';

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
