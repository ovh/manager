import React, { useCallback, useMemo, useState } from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  DeploymentTilesInput,
  PCICommonContext,
  RegionSelector,
  RegionSummary,
  TContinent,
  TDeployment,
  TLocalisation,
  usePCICommonContextFactory,
} from '@ovh-ux/manager-pci-common';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { StepState } from '@/pages/new/hooks/useStep';
import { useVolumeRegions } from '@/api/hooks/useCatalog';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { TRegion } from '@/api/data/regions';
import { useTrackAction } from '@/hooks/useTrackAction';
import { Button } from '@/components/button/Button';

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
  const {
    data: { deployments, regions },
    isPending,
  } = useVolumeRegions(projectId);

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
        ? regions.find((r) => r.name === selectedLocalisation.name)
        : null,
    [regions, selectedLocalisation],
  );

  const hasRegion = !!selectedLocalisation;

  const { has3AZ } = useHas3AZRegion(projectId);
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const selectedDeploymentRegions = useMemo(
    () =>
      selectedRegionGroup
        ? regions?.filter((r) =>
            r.filters.deployment.includes(selectedRegionGroup.name),
          )
        : regions,
    [regions, selectedRegionGroup],
  );

  const deploymentsWithPrice = useMemo(
    () =>
      deployments.map<TDeployment>((d) => ({
        ...d,
        price: d.monthlyPrice,
      })) || [],
    [deployments],
  );

  const onSubmit = useCallback(() => {
    setSelectedRegionGroup(
      deploymentsWithPrice.find(
        (g) => g.name === selectedRegion.filters.deployment[0],
      ),
    );
    parentSubmit(selectedRegion);
  }, [deploymentsWithPrice, selectedRegion, parentSubmit]);

  const onTrackingDeploymentChange = useTrackAction(
    (regionGroup) => ({
      buttonType: 'tile',
      actionName: 'select_deployment',
      actionValues: [regionGroup?.name],
    }),
    setSelectedRegionGroup,
  );

  const onTrackingSelectRegion = useTrackAction(
    (localisation) => ({
      buttonType: 'tile',
      actionName: 'select_location',
      actionValues: [localisation.name],
    }),
    setSelectedLocalisation,
  );

  const onTrackingSelectContinent = useTrackAction((continent: TContinent) => ({
    buttonType: 'go-to-tab',
    actionName: 'select_continent',
    actionValues: [continent.code],
  }));

  if (isPending) return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;

  return (
    <PCICommonContext.Provider value={pciCommonProperties}>
      <div>
        <DeploymentTilesInput
          name="deployment"
          value={selectedRegionGroup}
          onChange={onTrackingDeploymentChange}
          deployments={deploymentsWithPrice}
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
              onSelectRegion={onTrackingSelectRegion}
              onSelectContinent={onTrackingSelectContinent}
              regionFilter={(r) =>
                r.isMacro ||
                selectedDeploymentRegions.some((r2) => r2.name === r.name)
              }
            />
          </div>
        )}
      </div>
      {hasRegion && !step.isLocked && (
        <Button
          className="mt-4 w-fit"
          size="md"
          color="primary"
          onClick={onSubmit}
          actionName="select_location_add"
          actionValues={[selectedRegion?.name]}
        >
          {t('common_stepper_next_button_label')}
        </Button>
      )}
    </PCICommonContext.Provider>
  );
}
