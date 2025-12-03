import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import type { CustomSnapshot, SnapshotType, SnapshotTypeValue } from '@/types/Snapshot.type';

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

// Transform snapshot type value to label
function getSnapshotTypeLabel(typeValue: SnapshotTypeValue, t: (key: string) => string): string {
  const labelKey = `partition:snapshots.type_${typeValue}`;
  const translated = t(labelKey);
  // If translation is the same as key, return a formatted version of the value
  return translated === labelKey ? typeValue : translated;
}

/**
 * Hook to fetch snapshot types and transform them to include enabled/label
 */
export function usePartitionSnapshotTypes(serviceName: string, partitionName: string) {
  const { t } = useTranslation(['partition']);

  return useQuery<SnapshotType[]>({
    queryKey: QUERY_KEY_TYPES(serviceName, partitionName),
    queryFn: async () => {
      const { data } = await httpV6.get<SnapshotTypeValue[]>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/snapshot`,
      );

      // Transform string[] to SnapshotType[] with enabled=true (API returns only enabled types)
      return data.map((typeValue) => ({
        value: typeValue,
        enabled: true,
        label: getSnapshotTypeLabel(typeValue, t),
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
