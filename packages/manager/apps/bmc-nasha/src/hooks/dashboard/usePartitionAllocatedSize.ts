import { useQuery } from '@tanstack/react-query';

import { fetchListing } from '@/data/api/Client.api';
import type { PartitionRaw } from '@/types/Dashboard.type';

export function usePartitionAllocatedSize(serviceName: string) {
  return useQuery({
    queryKey: ['nasha', 'partitionAllocatedSize', serviceName],
    queryFn: async (): Promise<number> => {
      const result = await fetchListing<PartitionRaw>(
        `/dedicated/nasha/${serviceName}/partition`,
      );
      return result.data.reduce(
        (totalSize, partition) => totalSize + partition.size,
        0,
      );
    },
    enabled: !!serviceName,
    select: (data) => data,
  });
}

