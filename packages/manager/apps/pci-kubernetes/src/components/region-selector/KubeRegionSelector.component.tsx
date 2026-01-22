import { useCallback, useState } from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { use3azAvailability } from '@/hooks/useFeatureAvailability';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import { DeploymentMode, TClusterPlanEnum } from '@/types';
import { TLocation } from '@/types/region';

import usePlanToRegionAvailability from '../../api/hooks/usePlanToRegionAvailability';
import './KubeRegionSelector.css';
import { RegionSelector } from './RegionSelector.component';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: (region: TLocation | null) => void;
  selectedDeployment?: DeploymentMode;
}

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
  selectedDeployment,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = usePlanToRegionAvailability(projectId, 'mks');

  const [selectedPlan, setSelectedPlan] = useState<TClusterPlanEnum>(TClusterPlanEnum.ALL);

  const { data: featureFlipping3az } = use3azAvailability();

  const { contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const filterRegion = useCallback(
    (region: TLocation) => {
      if (isPending) return false;
      if (region.isMacro) return true;

      const matchesPlan = (codes: string[]) =>
        selectedPlan === TClusterPlanEnum.ALL || codes.some((code) => code.includes(selectedPlan));

      const matchesDeployment = (type: string) =>
        !selectedDeployment || type === selectedDeployment;

      const matchesRegion = (name: string) => name === region.name;

      return availability.some(
        ({ name, type, codes }) =>
          matchesRegion(name) && matchesDeployment(type) && matchesPlan(codes),
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
        regionFilter={filterRegion}
        compactMode={!has3AZ}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
