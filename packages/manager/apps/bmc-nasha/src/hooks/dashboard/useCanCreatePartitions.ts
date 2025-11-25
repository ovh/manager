import { useMemo } from 'react';

import { SIZE_MIN } from '@/constants/Nasha.constants';

import { useNashaDetail } from './useNashaDetail';
import { usePartitionAllocatedSize } from './usePartitionAllocatedSize';

/**
 * Hook to check if user can create new partitions
 * Equivalent to canCreatePartitions resolve in dashboard.routing.js
 */
export function useCanCreatePartitions(serviceName: string) {
  const { data: nasha } = useNashaDetail(serviceName);
  const { data: partitionAllocatedSize } = usePartitionAllocatedSize(serviceName);

  const canCreatePartitions = useMemo(() => {
    if (!nasha || partitionAllocatedSize === undefined) {
      return false;
    }

    const SIZE_MIN_BYTES = SIZE_MIN * 1024 * 1024 * 1024; // Convert GB to bytes
    return partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN_BYTES;
  }, [nasha, partitionAllocatedSize]);

  return {
    canCreatePartitions,
    partitionAllocatedSize: partitionAllocatedSize ?? 0,
    isLoading: !nasha || partitionAllocatedSize === undefined,
  };
}
