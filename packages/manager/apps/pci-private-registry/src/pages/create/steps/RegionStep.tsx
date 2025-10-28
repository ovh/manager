import {
  StepComponent,
  Subtitle,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  DeploymentTilesInput,
  RegionSummary,
  TDeployment,
  TLocalisation,
  useProjectLocalisation,
  useParam,
} from '@ovh-ux/manager-pci-common';
import { PRIVATE_REGISTRY_CREATE_LOCATION_NEXT } from '@/pages/create/constants';
import { StepEnum } from '@/pages/create/types';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import { useStore } from '@/pages/create/store';
import { use3AZFeatureAvailability } from '@/hooks/features/use3AZFeatureAvailability';
import { DeploymentMode } from '@/types';

export default function RegionStep({
  isLocked,
}: Readonly<{
  isLocked?: boolean;
}>) {
  const { t } = useTranslation(['create', 'common_field']);

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const { tracking } = useContext(ShellContext)?.shell || {};

  const { projectId } = useParam('projectId');

  const store = useStore();

  const { stepsHandle } = store;

  const { data: localisations, isPending } = useProjectLocalisation(projectId);
  const { data: capabilities } = useGetCapabilities(projectId);

  const {
    is3AZEnabled,
    isPending: isFeatureAvailabilityPending,
  } = use3AZFeatureAvailability();

  const regions = useMemo(() => {
    if (Array.isArray(localisations?.regions)) {
      return localisations.regions
        .filter((region) =>
          is3AZEnabled ? region : region.type !== DeploymentMode.MULTI_ZONES,
        )
        .filter((region) =>
          (capabilities || [])
            .map((capacity) => capacity.regionName)
            .includes(region.name),
        )
        .reverse();
    }
    return [];
  }, [localisations, capabilities]);

  const deploymentZones = useMemo(
    () =>
      regions.reduce((acc: TDeployment[], region: TLocalisation) => {
        const deploymentZone = acc.find((zone) => zone.name === region.type);
        if (!deploymentZone)
          acc.push({
            name: region.type,
          });

        return acc;
      }, []),
    [regions],
  );

  const selectedDeploymentRegions = useMemo(
    () =>
      selectedRegionGroup
        ? regions?.filter((region) => region.type === selectedRegionGroup.name)
        : regions,
    [regions, selectedRegionGroup],
  );

  const handleRegionChange = useCallback(
    (regionGroup: TDeployment) => {
      setSelectedRegionGroup({
        name: regionGroup.name,
      });
      store.set.region(null);
    },
    [store.set],
  );

  const handleLocalisationChange = useCallback(
    (region: TLocalisation) => {
      store.set.region(region);
      setSelectedRegionGroup({
        name: region.type,
      });
    },
    [store.set],
  );

  useEffect(() => {
    if (!!capabilities?.length && store.state.region) {
      const regionCapability = capabilities.find(
        (c) => store.state.region && c.regionName === store.state.region.name,
      );
      if (regionCapability) {
        const plan =
          regionCapability.plans.find((p) => p.name === 'MEDIUM') ||
          regionCapability.plans[0];

        if (plan) store.set.plan(plan);
      }
    }
  }, [capabilities, store.set, store.state.region]);

  const getContinent = useCallback(
    (continent: string) =>
      continent ||
      (localisations?.continents || []).find((c) => c.code === 'WORLD')?.name,
    [localisations?.continents],
  );

  useEffect(() => {
    if (is3AZEnabled) {
      handleRegionChange({ name: DeploymentMode.MULTI_ZONES });
    }
  }, [is3AZEnabled, handleRegionChange]);

  return (
    <StepComponent
      isOpen={store.stepsState[StepEnum.REGION].isOpen}
      isLocked={isLocked || store.stepsState[StepEnum.REGION].isLocked}
      isChecked={store.stepsState[StepEnum.REGION].isChecked}
      order={1}
      title={t('create:private_registry_create_location')}
      next={{
        action: () => {
          stepsHandle.check(StepEnum.REGION);
          stepsHandle.lock(StepEnum.REGION);

          stepsHandle.open(StepEnum.NAME);

          tracking?.trackClick({
            name: PRIVATE_REGISTRY_CREATE_LOCATION_NEXT,
            type: 'action',
          });
        },
        label: t('common_field:common_stepper_next_button_label'),
        isDisabled: !store.state.region,
      }}
      edit={{
        action: () => {
          stepsHandle.close(StepEnum.NAME);
          stepsHandle.uncheck(StepEnum.NAME);
          stepsHandle.unlock(StepEnum.NAME);

          stepsHandle.close(StepEnum.PLAN);
          stepsHandle.uncheck(StepEnum.PLAN);
          stepsHandle.unlock(StepEnum.PLAN);

          stepsHandle.uncheck(StepEnum.REGION);
          stepsHandle.unlock(StepEnum.REGION);
        },
        label: t('common_field:common_stepper_modify_this_step'),
      }}
    >
      {isPending ? (
        <OsdsSpinner
          role="status"
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block text-center"
        />
      ) : (
        <div>
          {!isFeatureAvailabilityPending && is3AZEnabled && (
            <div>
              <DeploymentTilesInput
                name="deployment"
                value={selectedRegionGroup}
                onChange={handleRegionChange}
                deployments={deploymentZones}
                locked={isLocked}
              />
              <div className="mb-6">
                <Subtitle>
                  {t('create:private_registry_create_location')}
                </Subtitle>
              </div>
            </div>
          )}

          {isLocked && store.state.region ? (
            <RegionSummary region={store.state.region} />
          ) : (
            <TilesInputComponent
              items={selectedDeploymentRegions}
              value={store.state.region}
              onInput={handleLocalisationChange}
              label={(region) => region.microLabel}
              group={{
                by: (region) => region.continentLabel,
                label: (continent: string) => (
                  <OsdsText
                    break-spaces="false"
                    size={ODS_TEXT_SIZE._600}
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._400}
                  >
                    <div className="whitespace-nowrap px-2 text-lg">
                      {getContinent(continent)}
                    </div>
                  </OsdsText>
                ),
                showAllTab: true,
              }}
            />
          )}
        </div>
      )}
    </StepComponent>
  );
}
