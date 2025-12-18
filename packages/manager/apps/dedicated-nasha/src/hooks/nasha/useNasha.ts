import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNashaList,
  getNasha,
  getServiceInfos,
  getPartitionAllocatedSize,
  updateNasha,
  getSchema,
} from '@/api/nasha/nasha';
import type { Nasha, NashaServiceInfo, ApiSchema } from '@/types/nasha.type';

// Query keys
export const nashaKeys = {
  all: ['nasha'] as const,
  lists: () => [...nashaKeys.all, 'list'] as const,
  list: () => [...nashaKeys.lists()] as const,
  details: () => [...nashaKeys.all, 'details'] as const,
  detail: (serviceName: string) =>
    [...nashaKeys.details(), serviceName] as const,
  serviceInfo: (serviceName: string) =>
    [...nashaKeys.all, 'serviceInfo', serviceName] as const,
  partitionAllocatedSize: (serviceName: string) =>
    [...nashaKeys.all, 'partitionAllocatedSize', serviceName] as const,
  schema: () => [...nashaKeys.all, 'schema'] as const,
};

/**
 * Hook to get list of all NAS-HA services
 */
export const useNashaList = () => {
  return useQuery<Nasha[], Error>({
    queryKey: nashaKeys.list(),
    queryFn: getNashaList,
  });
};

/**
 * Hook to get a single NAS-HA service
 */
export const useNasha = (serviceName: string) => {
  return useQuery<Nasha, Error>({
    queryKey: nashaKeys.detail(serviceName),
    queryFn: () => getNasha(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get service info
 */
export const useServiceInfo = (serviceName: string) => {
  return useQuery<NashaServiceInfo, Error>({
    queryKey: nashaKeys.serviceInfo(serviceName),
    queryFn: () => getServiceInfos(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get total partition allocated size
 */
export const usePartitionAllocatedSize = (serviceName: string) => {
  return useQuery<number, Error>({
    queryKey: nashaKeys.partitionAllocatedSize(serviceName),
    queryFn: () => getPartitionAllocatedSize(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get API schema for enums
 */
export const useSchema = () => {
  return useQuery<ApiSchema, Error>({
    queryKey: nashaKeys.schema(),
    queryFn: getSchema,
    staleTime: Infinity, // Schema doesn't change
  });
};

/**
 * Hook to update NAS-HA settings
 */
export const useUpdateNasha = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { monitored?: boolean; customName?: string }) =>
      updateNasha(serviceName, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nashaKeys.detail(serviceName) });
    },
  });
};
