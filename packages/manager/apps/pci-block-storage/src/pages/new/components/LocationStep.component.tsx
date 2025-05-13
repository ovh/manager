import { useCallback, useMemo, useState } from 'react';
import { OsdsButton, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  DeploymentTilesInput,
  PCICommonContext,
  RegionSelector,
  RegionSummary,
  TDeployment,
  TLocalisation,
  usePCICommonContextFactory,
} from '@ovh-ux/manager-pci-common';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { StepState } from '@/pages/new/hooks/useStep';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { TRegion } from '@/api/data/regions';

interface LocationProps {
  projectId: string;
  step: StepState;
  onSubmit: (region: TRegion) => void;
}

export function LocationStep({
  projectId,
  step,
  onSubmit: parentSubmit,
}: Readonly<LocationProps>) {
  const { t } = useTranslation(['stepper', 'add']);
  const { data: volumeCatalog, isPending } = useVolumeCatalog(projectId);

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);
  const [selectedLocalisation, setSelectedLocalisation] = useState<
    TLocalisation
  >(undefined);
  const selectedRegion = useMemo(
    () =>
      selectedLocalisation
        ? volumeCatalog.regions.find(
            (r) => r.name === selectedLocalisation.name,
          )
        : null,
    [volumeCatalog, selectedLocalisation],
  );

  const hasRegion = !!selectedLocalisation;

  const { has3AZ } = useHas3AZRegion(projectId);
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const regions = useMemo(
    () =>
      selectedRegionGroup
        ? volumeCatalog?.regions.filter((r) =>
            r.filters.deployment.includes(selectedRegionGroup.name),
          )
        : volumeCatalog?.regions,
    [volumeCatalog, selectedRegionGroup],
  );

  const deployments = useMemo(
    () =>
      volumeCatalog?.filters.deployment.map<TDeployment>((d) => ({
        name: d.name,
        beta: d.tags.includes('is_new'),
        comingSoon: d.tags.includes('coming_soon'),
      })) || [],
    [volumeCatalog],
  );

  const onSubmit = useCallback(() => {
    setSelectedRegionGroup(
      volumeCatalog.filters.deployment.find(
        (g) => g.name === selectedRegion.filters.deployment[0],
      ),
    );
    parentSubmit(selectedRegion);
  }, [volumeCatalog, selectedRegion, parentSubmit]);

  if (isPending) return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;

  return (
    <PCICommonContext.Provider value={pciCommonProperties}>
      <div>
        <DeploymentTilesInput
          name="deployment"
          value={selectedRegionGroup}
          onChange={setSelectedRegionGroup}
          deployments={deployments}
          locked={step.isLocked}
        />

        <div className="mb-6">
          <Subtitle>
            {t('add:pci_projects_project_storages_blocks_add_region_title')}
          </Subtitle>
        </div>
        {step.isLocked ? (
          <RegionSummary region={selectedLocalisation} />
        ) : (
          <div>
            <RegionSelector
              projectId={projectId}
              onSelectRegion={setSelectedLocalisation}
              regionFilter={(r) =>
                r.isMacro || regions.some((r2) => r2.name === r.name)
              }
            />
          </div>
        )}
      </div>
      {hasRegion && !step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onSubmit}
        >
          {t('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </PCICommonContext.Provider>
  );
}
