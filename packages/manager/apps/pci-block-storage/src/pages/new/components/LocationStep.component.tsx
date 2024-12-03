import { useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  isDiscoveryProject,
  useProject,
  RegionSelector,
  RegionSummary,
  usePCICommonContextFactory,
  PCICommonContext,
} from '@ovh-ux/manager-pci-common';
import { TLocalisation } from '@/api/hooks/useRegions';
import { StepState } from '@/pages/new/hooks/useStep';
import { useProjectsAvailableVolumes } from '@/api/hooks/useProjectsAvailableVolumes';
import { isRegionWith3AZ } from '@/api/data/availableVolumes';

interface LocationProps {
  projectId: string;
  step: StepState;
  onSubmit: (region: TLocalisation) => void;
}

const useHas3AZRegion = (projectId: string) => {
  const { data: availableVolumes, isPending } = useProjectsAvailableVolumes(
    projectId,
  );

  return {
    has3AZ:
      availableVolumes?.plans.some((p) => p.regions.some(isRegionWith3AZ)) ||
      false,
    isPending,
  };
};

export function LocationStep({
  projectId,
  step,
  onSubmit,
}: Readonly<LocationProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [region, setRegion] = useState<TLocalisation>(undefined);
  const { data: project } = useProject();
  const isDiscovery = isDiscoveryProject(project);
  const hasRegion = !!region;

  const { has3AZ } = useHas3AZRegion(projectId);
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  return (
    <PCICommonContext.Provider value={pciCommonProperties}>
      {hasRegion && step.isLocked && <RegionSummary region={region} />}
      {(!step.isLocked || isDiscovery) && (
        <RegionSelector
          projectId={projectId}
          onSelectRegion={setRegion}
          regionFilter={(r) =>
            r.isMacro ||
            r.services.some((s) => s.name === 'volume' && s.status === 'UP') ||
            r.type === 'region-3-az'
          }
        />
      )}
      {hasRegion && !step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(region)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </PCICommonContext.Provider>
  );
}
