import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getServiceConsumption } from '@/data/api/services/consumption';

import { queryKeys } from './queryKeys';
import { servicesQueries } from './services.queries';

// ─── Standalone functions (need QueryClient for dependency resolution) ───

const byResource = (queryClient: QueryClient) => (resourceName: string) =>
  queryOptions({
    queryKey: queryKeys.consumption.byResource(resourceName),
    queryFn: async () => {
      const serviceIds = await queryClient.ensureQueryData(
        servicesQueries.agoraServiceId(resourceName),
      );
      return getServiceConsumption(serviceIds.data[0]!);
    },
    retry: false,
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  byResource: byResource(queryClient),
});

export const consumptionQueries = { withClient };
