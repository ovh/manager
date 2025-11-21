import { useQuery } from '@tanstack/react-query';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

type Partition = {
  size: number;
  [key: string]: unknown;
};

const QUERY_KEY = (serviceName: string) => ['nasha-partition-allocated-size', serviceName] as const;

/**
 * Hook to calculate total allocated size of all partitions
 * Equivalent to partitionAllocatedSize resolve in dashboard.routing.js
 */
export function usePartitionAllocatedSize(serviceName: string) {
  return useQuery<number>({
    queryKey: QUERY_KEY(serviceName),
    queryFn: async () => {
      const result = await fetchIcebergV6<Partition>({
        route: `${APP_FEATURES.listingEndpoint}/${serviceName}/partition`,
        page: 1,
        pageSize: 1000, // Fetch all partitions
      });

      return result.data.reduce((totalSize, partition) => totalSize + partition.size, 0);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
