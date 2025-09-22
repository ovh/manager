import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useProductAvailability } from '@ovh-ux/manager-pci-common';

export enum RegionType {
  Region = 'region',
  Localzone = 'localzone',
  Region3Az = 'region-3-az',
}

const useHas3AZRegions = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: availability } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });

  const product = availability?.products.find(({ name }) => name === 'kubernetes');

  const regionTypes = product?.regions.map(({ type }) => type) || [];

  const uniqueRegions = [...new Set(regionTypes)].sort((a, b) => {
    if (a === (RegionType.Region3Az as string)) return 1;
    if (b === (RegionType.Region3Az as string)) return -1;
    return 0;
  }) as RegionType[];

  return {
    contains3AZ: useMemo(() => uniqueRegions.includes(RegionType.Region3Az), [uniqueRegions]),
    uniqueRegions,
  };
};

export default useHas3AZRegions;
