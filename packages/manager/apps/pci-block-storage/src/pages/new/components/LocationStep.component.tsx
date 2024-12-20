import { useCallback, useContext, useMemo, useState } from 'react';
import {
  OsdsButton,
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Trans, useTranslation } from 'react-i18next';
import {
  isDiscoveryProject,
  PCICommonContext,
  RegionSelector,
  RegionSummary,
  TLocalisation,
  usePCICommonContextFactory,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepState } from '@/pages/new/hooks/useStep';
import { DeploymentModeSelector } from '@/pages/new/components/DeploymentModeSelector';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { TCatalogGroup } from '@/api/data/catalog';
import { DeploymentModeTileSummary } from '@/pages/new/components/DeploymentModeTileSummary';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { TRegion } from '@/api/data/regions';
import { GLOBAL_INFRASTRUCTURE_URL } from '@/pages/new/components/website-link';

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
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TCatalogGroup | null>(null);
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

  const { data: project } = useProject();
  const isDiscovery = isDiscoveryProject(project);
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
      {hasRegion && step.isLocked && (
        <div>
          <DeploymentModeTileSummary group={selectedRegionGroup} />
          <RegionSummary region={selectedLocalisation} />
        </div>
      )}
      {(!step.isLocked || isDiscovery) && (
        <div>
          <div>
            <Subtitle>
              {t(
                'add:pci_projects_project_storages_blocks_add_deployment_mode_title',
              )}
            </Subtitle>
            <div>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <Trans
                  i18nKey="add:pci_projects_project_storages_blocks_add_deployment_mode_description"
                  components={{
                    Link: (
                      <OsdsLink
                        href={
                          GLOBAL_INFRASTRUCTURE_URL[ovhSubsidiary] ??
                          GLOBAL_INFRASTRUCTURE_URL.DEFAULT
                        }
                        color={ODS_THEME_COLOR_INTENT.info}
                      />
                    ),
                  }}
                />
              </OsdsText>
            </div>
          </div>
          <DeploymentModeSelector
            deploymentGroups={volumeCatalog.filters.deployment}
            selectedRegionGroup={selectedRegionGroup}
            onChange={(group) => {
              setSelectedLocalisation(undefined);
              setSelectedRegionGroup(group);
            }}
          />

          <div>
            <Subtitle>
              {t('add:pci_projects_project_storages_blocks_add_region_title')}
            </Subtitle>
          </div>
          <RegionSelector
            projectId={projectId}
            onSelectRegion={setSelectedLocalisation}
            regionFilter={(r) =>
              r.isMacro || regions.some((r2) => r2.name === r.name)
            }
          />
        </div>
      )}
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
