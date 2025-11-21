import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { aapi } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

type PartitionUse = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type PartitionApiResponse = {
  partitionName: string;
  partitionDescription?: string;
  protocol?: string;
  size: number;
  use?: PartitionUse;
  [key: string]: unknown;
};

type PreparedPartition = {
  partitionName: string;
  partitionDescription?: string;
  protocol?: string;
  size: number;
  use?: PartitionUse;
};

/**
 * Prepare partition data (similar to preparePartition in nasha.utils.js)
 */
function preparePartition(
  partition: PartitionApiResponse,
  t: (key: string) => string,
): PreparedPartition {
  return {
    ...partition,
    use: partition.use
      ? Object.keys(partition.use).reduce(
          (result, type) => ({
            ...result,
            [type]: {
              ...partition.use![type],
              name: (() => {
                const key = `nasha_use_type_${type}`;
                const name = t(key);
                return name === key ? type : name;
              })(),
              unit: t(`nasha_use_unit_${partition.use![type]?.unit ?? 'B'}`),
            },
          }),
          {},
        )
      : undefined,
    protocol: partition.protocol?.split('_').join(' '),
  };
}

const QUERY_KEY = (serviceName: string, partitionName: string) =>
  ['nasha-partition-detail', serviceName, partitionName] as const;

/**
 * Hook to fetch and prepare partition details
 * Equivalent to partition resolve in partition.routing.js
 */
export function usePartitionDetail(serviceName: string, partitionName: string) {
  const { t, i18n } = useTranslation(['common', 'nasha']);

  return useQuery<PreparedPartition>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...QUERY_KEY(serviceName, partitionName), i18n.language],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<PartitionApiResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
      );

      // Prepare partition data
      return preparePartition(data, t);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
