import { useCallback, useState } from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { RegionSelectorProps } from '@ovh-ux/manager-pci-common';

import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import { DeploymentMode, TClusterPlanEnum } from '@/types';
import { TLocation } from '@/types/region';

import usePlanToRegionAvailability from '../../api/hooks/usePlanToRegionAvailability';
import './KubeRegionSelector.css';
import { RegionSelector } from './RegionSelector.component';

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

  const [selectedPlan, setSelectedPlan] = useState<TClusterPlanEnum>(TClusterPlanEnum.ALL);

  const featureFlipping3az = use3AZPlanAvailable();
  const { contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const regionFilter = useCallback(
    (region: TLocation) => {
      return Boolean(
        region.isMacro ||
          (!isPending &&
            availability.some(
              ({ name, type, codes }) =>
                (selectedPlan === TClusterPlanEnum.ALL ||
                  codes.some((code) => code.includes(selectedPlan))) &&
                (selectedDeployment
                  ? name === region.name && type === selectedDeployment
                  : name === region.name),
            )),
      );
    },
    [availability, isPending, selectedPlan, selectedDeployment],
  );

  if (isPending) {
    return <OsdsSpinner data-testid="spinner" inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div data-testid="region-selector" className="mt-6">
      <RegionSelector
        projectId={projectId}
        onSelectRegion={onSelectRegion}
        onSelectPlan={setSelectedPlan}
        regionFilter={regionFilter}
        compactMode={!has3AZ}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
