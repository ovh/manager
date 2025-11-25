import { useQuery } from '@tanstack/react-query';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

type PartitionAccess = {
  ip: string;
  type: string;
  aclDescription?: string;
  [key: string]: unknown;
};

const QUERY_KEY = (serviceName: string, partitionName: string) =>
  ['nasha-partition-accesses', serviceName, partitionName] as const;

/**
 * Hook to fetch partition accesses list
 * Equivalent to loadAccesses in accesses.controller.js
 */
export function usePartitionAccesses(serviceName: string, partitionName: string) {
  return useQuery<PartitionAccess[]>({
    queryKey: QUERY_KEY(serviceName, partitionName),
    queryFn: async () => {
      const result = await fetchIcebergV6<PartitionAccess>({
        route: `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/access`,
        page: 1,
        pageSize: 1000, // Fetch all accesses
      });

      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
