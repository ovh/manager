import { useContext, useState } from 'react';
import { OsdsButton, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Trans, useTranslation } from 'react-i18next';
import {
  isDiscoveryProject,
  useProject,
  RegionSelector,
  RegionSummary,
  usePCICommonContextFactory,
  PCICommonContext,
} from '@ovh-ux/manager-pci-common';
import { OvhSubsidiary, Subtitle } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TLocalisation } from '@/api/hooks/useRegions';
import { StepState } from '@/pages/new/hooks/useStep';
import { useProjectsAvailableVolumes } from '@/api/hooks/useProjectsAvailableVolumes';
import { isRegionWith3AZ } from '@/api/data/availableVolumes';
import { DeploymentModeStep } from '@/pages/new/components/DeploymentModeStep';
import { getBaseUrl } from '@/website/ovhWebsiteMapper';

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
  const { t } = useTranslation(['stepper', 'add']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

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
                        href={getBaseUrl(ovhSubsidiary as OvhSubsidiary)}
                        color={ODS_THEME_COLOR_INTENT.info}
                      />
                    ),
                  }}
                />
              </OsdsText>
            </div>
          </div>
          {/* <DeploymentModeStep /> */}

          <div>
            <Subtitle>
              {t('add:pci_projects_project_storages_blocks_add_region_title')}
            </Subtitle>
          </div>
          <RegionSelector
            projectId={projectId}
            onSelectRegion={setRegion}
            regionFilter={(r) =>
              r.isMacro ||
              r.services.some((s) => s.name === 'volume' && s.status === 'UP')||
              r.type === 'region-3-az'}
          />
        </div>
      )}
      {hasRegion && !step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(region)}
        >
          {t('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </PCICommonContext.Provider>
  );
}
