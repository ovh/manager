import { useCallback } from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import { DeploymentMode } from '@/types';
import { TLocation } from '@/types/region';

import usePlanToRegionAvailability from '../../api/hooks/usePlanToRegionAvailability';
import './KubeRegionSelector.css';
import { RegionSelector, RegionSelectorProps } from './RegionSelector.component';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
  selectedDeployment?: DeploymentMode;
}

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
  selectedDeployment,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = usePlanToRegionAvailability(projectId, 'mks');

  const featureFlipping3az = use3AZPlanAvailable();
  const { contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const regionFilter = useCallback(
    (region: TLocation) => {
      return Boolean(
        region.isMacro ||
          (!isPending &&
            availability.some(({ name, type }) =>
              selectedDeployment
                ? name === region.name && type === selectedDeployment
                : name === region.name,
            )),
      );
    },
    [availability, isPending, selectedDeployment],
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
