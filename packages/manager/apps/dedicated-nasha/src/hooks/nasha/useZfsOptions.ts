import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getZfsOptions, updateZfsOptions } from '@/api/nasha/nasha';
import type { NashaZfsOptions, NashaTask } from '@/types/nasha.type';
import { partitionKeys } from './usePartitions';

// Query keys for ZFS options
export const zfsOptionsKeys = {
  all: (serviceName: string, partitionName: string) =>
    [...partitionKeys.detail(serviceName, partitionName), 'zfsOptions'] as const,
};

/**
 * Hook to get ZFS options for a partition
 */
export const useZfsOptions = (serviceName: string, partitionName: string) => {
  return useQuery<NashaZfsOptions, Error>({
    queryKey: zfsOptionsKeys.all(serviceName, partitionName),
    queryFn: () => getZfsOptions(serviceName, partitionName),
    enabled: !!serviceName && !!partitionName,
    retry: (failureCount, error) => {
      // Don't retry on 404 (options not set yet)
      if ((error as { status?: number })?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to update ZFS options for a partition
 */
export const useUpdateZfsOptions = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    Partial<NashaZfsOptions> | { templateName: string }
  >({
    mutationFn: (options) =>
      updateZfsOptions(serviceName, partitionName, options),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: zfsOptionsKeys.all(serviceName, partitionName),
      });
    },
  });
};

