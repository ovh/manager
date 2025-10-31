import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePreparePartition } from '@/utils/nasha.utils';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';
import type { PartitionPrepared, PartitionApiData } from '@/types/Dashboard.type';

export function usePartitions(serviceName: string) {
  const preparePartition = usePreparePartition();

  return useQuery({
    queryKey: ['nasha-partitions', serviceName],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<PartitionApiData[]>(`${NASHA_BASE_API_URL}/${serviceName}/partition`);
      const prepared = data.map((partition) => preparePartition(partition));
      return {
        data: prepared,
        meta: { totalCount: prepared.length },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
