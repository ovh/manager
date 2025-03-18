import {
  RegionSelector,
  RegionSelectorProps,
  TRegion,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import './KubeRegionSelector.css';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { mockAvailabilityWith3az } from '@/mocks/mockAvaibility';

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
  const { data: availability, isPending } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });
  const featureFlipping3az = use3AZPlanAvailable();
  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }
  return (
    <div className="mt-6">
      <RegionSelector
        projectId={projectId}
        onSelectRegion={onSelectRegion}
        regionFilter={(region) => {
          const product = mockAvailabilityWith3az?.products.find(
            ({ name }) => name === 'kubernetes',
          );
          if (selectedDeployment) {
            return product.regions.some(
              ({ name, type }) =>
                name === region.name && type === selectedDeployment,
            );
          }
          return product.regions.some(({ name }) => name === region.name);
        }}
        compactMode={featureFlipping3az}
      />
    </div>
  );
}
