import { useQuery } from '@tanstack/react-query';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

type CustomSnapshot = string;

type SnapshotType = string;

const QUERY_KEY_CUSTOM = (serviceName: string, partitionName: string) =>
  ['nasha-partition-custom-snapshots', serviceName, partitionName] as const;

const QUERY_KEY_TYPES = (serviceName: string, partitionName: string) =>
  ['nasha-partition-snapshot-types', serviceName, partitionName] as const;

/**
 * Hook to fetch custom snapshots list
 */
export function usePartitionCustomSnapshots(serviceName: string, partitionName: string) {
  return useQuery<CustomSnapshot[]>({
    queryKey: QUERY_KEY_CUSTOM(serviceName, partitionName),
    queryFn: async () => {
      const { data } = await httpV6.get<CustomSnapshot[]>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/customSnapshot`,
      );
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}

/**
 * Hook to fetch snapshot types
 */
export function usePartitionSnapshotTypes(serviceName: string, partitionName: string) {
  return useQuery<SnapshotType[]>({
    queryKey: QUERY_KEY_TYPES(serviceName, partitionName),
    queryFn: async () => {
      const { data } = await httpV6.get<SnapshotType[]>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/snapshot`,
      );
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
