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
import { useParams } from 'react-router-dom';
import {
  DeploymentTilesInput,
  RegionSummary,
  TDeployment,
  TLocalisation,
  useProjectLocalisation,
} from '@ovh-ux/manager-pci-common';
import { PRIVATE_REGISTRY_CREATE_LOCATION_NEXT } from '@/pages/create/constants';
import { StepEnum } from '@/pages/create/types';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import { useStore } from '@/pages/create/store';
import { TCapability } from '@/api/data/capability';
import { use3AZFeatureAvailability } from '@/hooks/features/use3AZFeatureAvailability';

// TODO: remove when 3AZ registry available
const mocked3AZCapability: TCapability = {
  regionName: 'EU-WEST-PAR',
  plans: [
    {
      code: 'registry.s-plan-equivalent.hour.consumption',
      createdAt: '2019-09-13T15:53:33.599585Z',

      updatedAt: '2021-03-29T10:09:03.960847Z',
      name: 'SMALL',
      id: '9f728ba5-998b-4401-ab0f-497cd8bc6a89',
      registryLimits: {
        imageStorage: 214748364800,
        parallelRequest: 15,
      },
      features: {
        vulnerability: false,
      },
    },
    {
      code: 'registry.m-plan-equivalent.hour.consumption',
      createdAt: '2019-09-13T15:53:33.601794Z',
      updatedAt: '2023-12-04T11:03:43.109685Z',
      name: 'MEDIUM',
      id: 'c5ddc763-be75-48f7-b7ec-e923ca040bee',
      registryLimits: {
        imageStorage: 644245094400,
        parallelRequest: 45,
      },
      features: {
        vulnerability: true,
      },
    },
    {
      code: 'registry.l-plan-equivalent.hour.consumption',
      createdAt: '2019-09-13T15:53:33.603052Z',
      updatedAt: '2023-12-04T10:51:15.658746Z',
      name: 'LARGE',
      id: '0dae73df-6c49-47bf-a9d5-6b866c74ac54',
      registryLimits: {
        imageStorage: 5497558138880,
        parallelRequest: 90,
      },
      features: {
        vulnerability: true,
      },
    },
  ],
};

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

  const { projectId } = useParams();

  const store = useStore();

  const { stepsHandle } = store;

  const { data: localisations, isPending } = useProjectLocalisation(projectId);
  const { data: capabilities } = useGetCapabilities(projectId);

  const {
    is3AZEnabled,
    isPending: isFeatureAvailabilityPending,
  } = use3AZFeatureAvailability();

  const mockedCapabilities = [...(capabilities || []), mocked3AZCapability];

  const regions = useMemo(() => {
    if (Array.isArray(localisations?.regions)) {
      return localisations.regions
        .filter((region) =>
          (mockedCapabilities || [])
            .map((capacity) => capacity.regionName)
            .includes(region.name),
        )
        .reverse();
    }
    return [];
  }, [localisations, mockedCapabilities]);

  const getDeploymentZones = (acc: TDeployment[], region: TLocalisation) => {
    const deploymentZone = acc.find((zone) => zone.name === region.type);
    if (!deploymentZone)
      acc.push({
        name: region.type,
      });

    return acc;
  };

  const deploymentZones = useMemo(
    () => regions.reduce(getDeploymentZones, []),
    [regions],
  );

  const selectedDeploymentRegions = useMemo(
    () =>
      selectedRegionGroup
        ? regions?.filter((region) => region.type === selectedRegionGroup.name)
        : regions,
    [regions, selectedRegionGroup],
  );

  const handleLocalisationChange = useCallback((region: TLocalisation) => {
    store.set.region(region);
    setSelectedRegionGroup({
      name: region.type,
    });
  }, []);

  useEffect(() => {
    if (mockedCapabilities?.length && store.state.region) {
      const regionCapability = mockedCapabilities.find(
        (c) => c.regionName === store.state.region.name,
      );
      if (regionCapability) {
        const plan =
          regionCapability.plans.find((p) => p.name === 'MEDIUM') ||
          regionCapability.plans[0];

        if (plan) store.set.plan(plan);
      }
    }
  }, [capabilities, store.state.region]);

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
                onChange={setSelectedRegionGroup}
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

          {isLocked ? (
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
                      {continent ||
                        (localisations?.continents || []).find(
                          (c) => c.code === 'WORLD',
                        )?.name}
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
