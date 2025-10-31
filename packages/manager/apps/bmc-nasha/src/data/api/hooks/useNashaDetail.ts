import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePrepareNasha } from '@/utils/nasha.utils';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';
import type { NashaPrepared, NashaApiData } from '@/types/Dashboard.type';

export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();

  return useQuery({
    queryKey: ['nasha-detail', serviceName],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<NashaApiData>(`${NASHA_BASE_API_URL}/${serviceName}`);
      return prepareNasha(data) as NashaPrepared;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useServiceInfo(serviceName: string) {
  return useQuery({
    queryKey: ['nasha-service-info', serviceName],
    queryFn: async () => {
      const { v6 } = await import('@ovh-ux/manager-core-api');
      const { data } = await v6.get(`${NASHA_BASE_API_URL}/${serviceName}/serviceInfos`);
      return { ...data, serviceType: 'DEDICATED_NASHA' };
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function usePartitionAllocatedSize(serviceName: string) {
  return useQuery({
    queryKey: ['nasha-partition-allocated-size', serviceName],
    queryFn: async () => {
      const { fetchIcebergV6 } = await import('@ovh-ux/manager-core-api');
      const result = await fetchIcebergV6<{ size: number }>({
        route: `${NASHA_BASE_API_URL}/${serviceName}/partition`,
        page: 1,
        pageSize: 1000,
      });
      return result.data.reduce(
        (totalSize: number, partition: { size: number }) => totalSize + partition.size,
        0,
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCanCreatePartitions(serviceName: string, nashaZpoolSize?: number) {
  const { data: allocatedSize } = usePartitionAllocatedSize(serviceName);
  // SIZE_MIN is 10 GB, convert to bytes for comparison
  // Both allocatedSize and zpoolSize should be in bytes from the API
  // SIZE_MIN = 10 GB = 10 * 1024^3 bytes
  const SIZE_MIN_BYTES = 10 * 1024 * 1024 * 1024;

  return {
    canCreatePartitions:
      allocatedSize !== undefined &&
      nashaZpoolSize !== undefined &&
      nashaZpoolSize > 0 &&
      allocatedSize <= nashaZpoolSize - SIZE_MIN_BYTES,
    allocatedSize,
  };
}
