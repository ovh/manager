import { useTranslation } from 'react-i18next';

import { NASHA_USE_SIZE_NAME } from '@/constants/Nasha.constants';
import type { NashaApiData, NashaPrepared, PartitionApiData, PartitionPrepared } from '@/types/Dashboard.type';

/**
 * Prepares use data with translations
 */
const prepareUse = (
  use: Record<string, { unit: string; value: number }>,
  t: (key: string) => string,
): Record<string, { unit: string; value: number; name: string }> => {
  return Object.keys(use).reduce(
    (result, type) => ({
      ...result,
      [type]: {
        ...use[type],
        name: (() => {
          const key = `nasha_use_type_${type}`;
          const name = t(key);
          return name === key ? type : name;
        })(),
        unit: t(`nasha_use_unit_${use[type].unit}`),
      },
    }),
    {},
  );
};

/**
 * Prepares Nasha data for display
 */
export const prepareNasha = (
  { use, ...nasha }: NashaApiData,
  t: (key: string) => string,
): NashaPrepared => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(use, t),
    localeDatacenter: t(`nasha_datacenter_${nasha.datacenter.toLowerCase()}`),
    diskSize: `${useSize.value} ${t(`nasha_use_unit_${useSize.unit}`)}`,
  };
};

/**
 * Prepares Partition data for display
 */
export const preparePartition = (
  { use, ...partition }: PartitionApiData,
  t: (key: string) => string,
): PartitionPrepared => ({
  ...partition,
  use: use ? prepareUse(use, t) : null,
  protocol: partition.protocol?.split('_').join(' '),
});

/**
 * Hook to prepare Nasha data
 */
export const usePrepareNasha = () => {
  const { t } = useTranslation();
  return (nasha: NashaApiData) => prepareNasha(nasha, t);
};

/**
 * Hook to prepare Partition data
 */
export const usePreparePartition = () => {
  const { t } = useTranslation();
  return (partition: PartitionApiData) => preparePartition(partition, t);
};
