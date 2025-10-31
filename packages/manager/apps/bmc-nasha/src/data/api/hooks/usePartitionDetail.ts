import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { usePreparePartition } from '@/utils/nasha.utils';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';
import type { PartitionPrepared, PartitionApiData } from '@/types/Dashboard.type';

export function usePartitionDetail(serviceName: string, partitionName: string) {
  const preparePartition = usePreparePartition();

  return useQuery({
    queryKey: ['nasha-partition-detail', serviceName, partitionName],
    queryFn: async () => {
      const { data } = await v6.get<PartitionApiData>(
        `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}`,
      );
      return preparePartition(data) as PartitionPrepared;
    },
    enabled: !!serviceName && !!partitionName,
    staleTime: 2 * 60 * 1000,
  });
}
