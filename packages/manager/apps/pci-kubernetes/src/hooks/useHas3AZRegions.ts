import { useMemo } from 'react';

import { useParam } from '@ovh-ux/manager-pci-common';

import usePlanToRegionAvailability from '@/api/hooks/usePlanToRegionAvailability';
import { DeploymentMode } from '@/types';

export enum RegionType {
  Region = 'region',
  Localzone = 'localzone',
  Region3Az = 'region-3-az',
}

const useHas3AZRegions = () => {
  const { projectId } = useParam('projectId');

  const { data: availability, isPending } = usePlanToRegionAvailability(projectId, 'mks');

  const regionTypes = (!isPending && availability.map(({ type }) => type)) || [];

  const uniqueRegions = [...new Set(regionTypes)].sort((a, b) => {
    if (a === DeploymentMode.MULTI_ZONES) return 1;
    if (b === DeploymentMode.MULTI_ZONES) return -1;
    return 0;
  });

  return {
    contains3AZ: useMemo(() => uniqueRegions.includes(DeploymentMode.MULTI_ZONES), [uniqueRegions]),
    uniqueRegions,
  };
};

export default useHas3AZRegions;
