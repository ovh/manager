import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAccesses,
  getAuthorizableIps,
  getAuthorizableBlocks,
  createAccess,
  deleteAccess,
} from '@/api/nasha/nasha';
import type {
  NashaAccess,
  NashaTask,
  CreateAccessParams,
  AuthorizedAccess,
} from '@/types/nasha.type';
import { partitionKeys } from './usePartitions';
import { ipBlockToNumber } from '@/utils/nasha.utils';

// Query keys for accesses
export const accessKeys = {
  all: (serviceName: string, partitionName: string) =>
    [...partitionKeys.detail(serviceName, partitionName), 'accesses'] as const,
  list: (serviceName: string, partitionName: string) =>
    [...accessKeys.all(serviceName, partitionName)] as const,
  authorizableIps: (serviceName: string, partitionName: string) =>
    [
      ...accessKeys.all(serviceName, partitionName),
      'authorizableIps',
    ] as const,
  authorizableBlocks: (serviceName: string, partitionName: string) =>
    [
      ...accessKeys.all(serviceName, partitionName),
      'authorizableBlocks',
    ] as const,
};

/**
 * Hook to get all accesses for a partition
 */
export const useAccesses = (serviceName: string, partitionName: string) => {
  return useQuery<NashaAccess[], Error>({
    queryKey: accessKeys.list(serviceName, partitionName),
    queryFn: () => getAccesses(serviceName, partitionName),
    enabled: !!serviceName && !!partitionName,
  });
};

// Alias for consistency with page imports
export const useNashaPartitionAccesses = useAccesses;

/**
 * Hook to get authorizable IPs for a partition
 */
export const useAuthorizableIps = (
  serviceName: string,
  partitionName: string,
  enabled = true,
) => {
  return useQuery<string[], Error>({
    queryKey: accessKeys.authorizableIps(serviceName, partitionName),
    queryFn: () => getAuthorizableIps(serviceName, partitionName),
    enabled: enabled && !!serviceName && !!partitionName,
  });
};

// Alias for consistency with page imports
export const useNashaPartitionAuthorizableIps = useAuthorizableIps;

/**
 * Hook to get authorizable IP blocks for a partition
 */
export const useAuthorizableBlocks = (
  serviceName: string,
  partitionName: string,
  enabled = true,
) => {
  return useQuery<string[], Error>({
    queryKey: accessKeys.authorizableBlocks(serviceName, partitionName),
    queryFn: () => getAuthorizableBlocks(serviceName, partitionName),
    enabled: enabled && !!serviceName && !!partitionName,
  });
};

// Alias for consistency with page imports
export const useNashaPartitionAuthorizableBlocks = useAuthorizableBlocks;

/**
 * Hook to get all authorized accesses (IPs and blocks combined)
 */
export const useAuthorizedAccesses = (
  serviceName: string,
  partitionName: string,
  existingAccesses: NashaAccess[] = [],
) => {
  const { data: ips = [], isLoading: isLoadingIps } = useAuthorizableIps(
    serviceName,
    partitionName,
  );
  const { data: blocks = [], isLoading: isLoadingBlocks } =
    useAuthorizableBlocks(serviceName, partitionName);

  const authorizedAccesses: AuthorizedAccess[] = [
    ...ips
      .filter((ip) => !existingAccesses.find((a) => a.ip === `${ip}/32`))
      .map((ip) => ({ type: 'IP', ip })),
    ...blocks
      .filter((block) => !existingAccesses.find((a) => a.ip === block))
      .map((block) => ({ type: 'IP/Block', ip: block })),
  ].sort(
    (a, b) => ipBlockToNumber(a.ip) - ipBlockToNumber(b.ip),
  );

  return {
    data: authorizedAccesses,
    isLoading: isLoadingIps || isLoadingBlocks,
  };
};

/**
 * Hook to create an access
 */
export const useCreateNashaPartitionAccess = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    { serviceName: string; partitionName: string; data: CreateAccessParams }
  >({
    mutationFn: ({ serviceName, partitionName, data }) =>
      createAccess(serviceName, partitionName, data),
    onSuccess: (_, { serviceName, partitionName }) => {
      queryClient.invalidateQueries({
        queryKey: accessKeys.list(serviceName, partitionName),
      });
      // Also invalidate authorizable IPs/blocks as they may have changed
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableIps(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableBlocks(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to delete an access
 */
export const useDeleteNashaPartitionAccess = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NashaTask,
    Error,
    { serviceName: string; partitionName: string; ip: string }
  >({
    mutationFn: ({ serviceName, partitionName, ip }) =>
      deleteAccess(serviceName, partitionName, ip),
    onSuccess: (_, { serviceName, partitionName }) => {
      queryClient.invalidateQueries({
        queryKey: accessKeys.list(serviceName, partitionName),
      });
      // Also invalidate authorizable IPs/blocks as they may have changed
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableIps(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableBlocks(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to create an access (legacy signature)
 * @deprecated Use useCreateNashaPartitionAccess instead
 */
export const useCreateAccess = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, CreateAccessParams>({
    mutationFn: (params) => createAccess(serviceName, partitionName, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessKeys.list(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableIps(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableBlocks(serviceName, partitionName),
      });
    },
  });
};

/**
 * Hook to delete an access (legacy signature)
 * @deprecated Use useDeleteNashaPartitionAccess instead
 */
export const useDeleteAccess = (
  serviceName: string,
  partitionName: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<NashaTask, Error, string>({
    mutationFn: (ip) => deleteAccess(serviceName, partitionName, ip),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessKeys.list(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableIps(serviceName, partitionName),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.authorizableBlocks(serviceName, partitionName),
      });
    },
  });
};

