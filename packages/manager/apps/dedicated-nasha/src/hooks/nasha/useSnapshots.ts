import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSnapshotTypes,
  createSnapshotType,
  deleteSnapshotType,
  getCustomSnapshots,
  createCustomSnapshot,
  deleteCustomSnapshot,
} from '@/api/nasha/nasha';
import type { NashaTask } from '@/types/nasha.type';
import { partitionKeys } from './usePartitions';

// Query keys for snapshots
export const snapshotKeys = {
  all: (serviceName: string, partitionName: string) =>
    [...partitionKeys.detail(serviceName, partitionName), 'snapshots'] as const,
  types: (serviceName: string, partitionName: string) =>
    [...snapshotKeys.all(serviceName, partitionName), 'types'] as const,
  custom: (serviceName: string, partitionName: string) =>
    [...snapshotKeys.all(serviceName, partitionName), 'custom'] as const,
};

/**
 * Hook to get snapshot types (frequencies) for a partition
 */
export const useSnapshotTypes = (
  serviceName: string,
  partitionName: string,
) => {
  return useQuery<string[], Error>({
    queryKey: snapshotKeys.types(serviceName, partitionName),
    queryFn: () => getSnapshotTypes(serviceName, partitionName),
    enabled: !!serviceName && !!partitionName,
  });
};

// Alias for consistency with page imports
export const useNashaPartitionSnapshots = useSnapshotTypes;

/**
 * Hook to get custom snapshots for a partition
 */
export const useCustomSnapshots = (
  serviceName: string,
  partitionName: string,
) => {
  return useQuery<string[], Error>({
    queryKey: snapshotKeys.custom(serviceName, partitionName),
    queryFn: () => getCustomSnapshots(serviceName, partitionName),
    enabled: !!serviceName && !!partitionName,
  });
};

// Alias for consistency with page imports
export const useNashaPartitionCustomSnapshots = useCustomSnapshots;

/**
 * Hook to create a snapshot (type or custom)
 */
export const useCreateNashaPartitionSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    {
      serviceName: string;
      partitionName: string;
      data: { snapshotType?: string; name?: string };
    }
  >({
    mutationFn: async ({ serviceName, partitionName, data }) => {
      if (data.snapshotType) {
        return createSnapshotType(serviceName, partitionName, data.snapshotType);
      }
      if (data.name) {
        return createCustomSnapshot(serviceName, partitionName, data.name);
      }
      throw new Error('Either snapshotType or name must be provided');
    },
    onSuccess: (_, { serviceName, partitionName, data }) => {
      if (data.snapshotType) {
        queryClient.invalidateQueries({
          queryKey: snapshotKeys.types(serviceName, partitionName),
        });
      }
      if (data.name) {
        queryClient.invalidateQueries({
          queryKey: snapshotKeys.custom(serviceName, partitionName),
        });
      }
    },
  });
};

/**
 * Hook to delete a snapshot type (frequency)
 */
export const useDeleteNashaPartitionSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    { serviceName: string; partitionName: string; snapshotType: string }
  >({
    mutationFn: ({ serviceName, partitionName, snapshotType }) =>
      deleteSnapshotType(serviceName, partitionName, snapshotType),
    onSuccess: (_, { serviceName, partitionName }) => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.types(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to delete a custom snapshot
 */
export const useDeleteNashaPartitionCustomSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    { serviceName: string; partitionName: string; customSnapshotName: string }
  >({
    mutationFn: ({ serviceName, partitionName, customSnapshotName }) =>
      deleteCustomSnapshot(serviceName, partitionName, customSnapshotName),
    onSuccess: (_, { serviceName, partitionName }) => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.custom(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to create a snapshot type (frequency)
 * @deprecated Use useCreateNashaPartitionSnapshot instead
 */
export const useCreateSnapshotType = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (snapshotType) =>
      createSnapshotType(serviceName, partitionName, snapshotType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.types(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to delete a snapshot type (frequency)
 * @deprecated Use useDeleteNashaPartitionSnapshot instead
 */
export const useDeleteSnapshotType = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (snapshotType) =>
      deleteSnapshotType(serviceName, partitionName, snapshotType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.types(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to create a custom snapshot
 * @deprecated Use useCreateNashaPartitionSnapshot instead
 */
export const useCreateCustomSnapshot = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (name) => createCustomSnapshot(serviceName, partitionName, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.custom(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to delete a custom snapshot
 * @deprecated Use useDeleteNashaPartitionCustomSnapshot instead
 */
export const useDeleteCustomSnapshot = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (name) => deleteCustomSnapshot(serviceName, partitionName, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.custom(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to update snapshot types (handles both create and delete)
 */
export const useUpdateSnapshotTypes = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask[],
    Error,
    { oldTypes: string[]; newTypes: string[] }
  >({
    mutationFn: async ({ oldTypes, newTypes }) => {
      const promises: Promise<NashaTask>[] = [];

      // Find types to add
      newTypes.forEach((type) => {
        if (!oldTypes.includes(type)) {
          promises.push(createSnapshotType(serviceName, partitionName, type));
        }
      });

      // Find types to remove
      oldTypes.forEach((type) => {
        if (!newTypes.includes(type)) {
          promises.push(deleteSnapshotType(serviceName, partitionName, type));
        }
      });

      const results = await Promise.all(promises);
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.types(serviceName, partitionName),
      });
    },
  });
};

