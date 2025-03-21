import { useCallback } from 'react';
import {
  RegionSelector,
  RegionSelectorProps,
  TRegion,
} from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import './KubeRegionSelector.css';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { mockedModule } from '@/mocks/mockAvaibility';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
  selectedDeployment: TRegion['type'];
}

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
  selectedDeployment,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = mockedModule.useProductAvailability(
    projectId,
    {
      product: 'kubernetes',
    },
  );

  const featureFlipping3az = use3AZPlanAvailable();

  const { contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const regionFilter = useCallback(
    (region) => {
      const product = availability?.products.find(
        ({ name }) => name === 'kubernetes',
      );

      return product.regions.some(({ name, type }) =>
        selectedDeployment
          ? name === region.name && type === selectedDeployment
          : name === region.name,
      );
    },
    [availability, selectedDeployment],
  );

  if (isPending) {
    return (
      <OsdsSpinner data-testid="spinner" inline size={ODS_SPINNER_SIZE.md} />
    );
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
