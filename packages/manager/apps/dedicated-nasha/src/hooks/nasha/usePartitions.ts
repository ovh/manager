import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPartitions,
  getPartitionsAapi,
  getPartition,
  createPartition,
  updatePartition,
  deletePartition,
} from '@/api/nasha/nasha';
import type {
  NashaPartition,
  NashaTask,
  CreatePartitionParams,
  UpdatePartitionParams,
} from '@/types/nasha.type';
import { nashaKeys } from './useNasha';

// Query keys for partitions
export const partitionKeys = {
  all: (serviceName: string) =>
    [...nashaKeys.detail(serviceName), 'partitions'] as const,
  lists: (serviceName: string) => [...partitionKeys.all(serviceName)] as const,
  list: (serviceName: string) => [...partitionKeys.lists(serviceName)] as const,
  details: (serviceName: string) =>
    [...partitionKeys.all(serviceName), 'detail'] as const,
  detail: (serviceName: string, partitionName: string) =>
    [...partitionKeys.details(serviceName), partitionName] as const,
};

/**
 * Hook to get all partitions for a NAS-HA
 */
export const usePartitions = (serviceName: string) => {
  return useQuery<NashaPartition[], Error>({
    queryKey: partitionKeys.list(serviceName),
    queryFn: () => getPartitions(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get all partitions with aggregated data via AAPI
 */
export const usePartitionsAapi = (serviceName: string) => {
  return useQuery<NashaPartition[], Error>({
    queryKey: [...partitionKeys.list(serviceName), 'aapi'],
    queryFn: () => getPartitionsAapi(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get a single partition
 */
export const usePartition = (serviceName: string, partitionName: string) => {
  return useQuery<NashaPartition, Error>({
    queryKey: partitionKeys.detail(serviceName, partitionName),
    queryFn: () => getPartition(serviceName, partitionName),
    enabled: !!serviceName && !!partitionName,
  });
};

/**
 * Hook to create a partition
 */
export const useCreatePartition = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, CreatePartitionParams>({
    mutationFn: (params) => createPartition(serviceName, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partitionKeys.list(serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: nashaKeys.partitionAllocatedSize(serviceName),
      });
    },
  });
};

/**
 * Hook to update a partition
 */
export const useUpdatePartition = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdatePartitionParams>({
    mutationFn: (params) => updatePartition(serviceName, partitionName, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partitionKeys.detail(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: partitionKeys.list(serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: nashaKeys.partitionAllocatedSize(serviceName),
      });
    },
  });
};

/**
 * Hook to delete a partition
 */
export const useDeletePartition = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (partitionName) => deletePartition(serviceName, partitionName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partitionKeys.list(serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: nashaKeys.partitionAllocatedSize(serviceName),
      });
    },
  });
};

