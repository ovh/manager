import { useQuery } from '@tanstack/react-query';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

const QUERY_KEY = ['nasha-services-check'] as const;

/**
 * Hook to check if user has any NASHA services
 * Equivalent to the redirectTo logic in nasha.routing.js
 * Uses Iceberg query with limit 1 to check existence
 */
export function useNashaServicesCheck() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const result = await fetchIcebergV6<unknown>({
        route: APP_FEATURES.listingEndpoint,
        page: 1,
        pageSize: 1,
      });
      return {
        hasServices: result.data.length > 0,
        count: result.totalCount ?? 0,
      };
    },
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
