import { useCallback } from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { RegionSelectorProps, TRegion, useProductAvailability } from '@ovh-ux/manager-pci-common';

import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import { TLocation } from '@/types/region';

import './KubeRegionSelector.css';
import { RegionSelector } from './RegionSelector.component';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
  selectedDeployment?: TRegion['type'];
}

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
  selectedDeployment,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });

  const featureFlipping3az = use3AZPlanAvailable();

  const { contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const regionFilter = useCallback(
    (region: TLocation) => {
      const product = availability?.products.find(({ name }) => name === 'kubernetes');

      return Boolean(
        region.isMacro ||
          product?.regions.some(({ name, type }) =>
            selectedDeployment
              ? name === region.name && type === selectedDeployment
              : name === region.name,
          ),
      );
    },
    [availability, selectedDeployment],
  );

  if (isPending) {
    return <OsdsSpinner data-testid="spinner" inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div data-testid="region-selector" className="mt-6">
      <RegionSelector
        projectId={projectId}
        onSelectRegion={onSelectRegion}
        regionFilter={regionFilter}
        compactMode={!has3AZ}
      />
    </div>
  );
}
