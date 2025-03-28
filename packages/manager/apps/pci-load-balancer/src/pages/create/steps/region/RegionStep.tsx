import { useMemo, useState } from 'react';
import {
  OsdsLink,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  Links,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import {
  RegionSelector,
  usePCICommonContextFactory,
  PCICommonContext,
  TRegion,
  TDeployment,
  DeploymentTilesInput,
  TProductAvailabilityRegion,
  usePCIFeatureAvailability,
  getDeploymentComingSoonKey,
  DEPLOYMENT_FEATURES,
  DEPLOYMENT_MODES_TYPES,
} from '@ovh-ux/manager-pci-common';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { useGetRegionPrivateNetworks } from '@/api/hook/useNetwork';

export type TRegionStepProps = {
  regions: TProductAvailabilityRegion[];
  ovhSubsidiary: string;
  projectId: string;
};

const isRegionWith3AZ = (regions: TProductAvailabilityRegion[]) =>
  regions.some((region) => region.type === 'region-3-az');

export const RegionStep = ({
  regions,
  ovhSubsidiary,
  projectId,
}: Readonly<TRegionStepProps>): JSX.Element => {
  const { t } = useTranslation(['load-balancer/create', 'pci-common']);
  const projectUrl = useProjectUrl('public-cloud');

  const { trackStep } = useTracking();

  const store = useCreateStore();

  const {
    list: networks,
    isFetching: isSearchingNetwork,
  } = useGetRegionPrivateNetworks(projectId, store.region?.name || '');

  const has3AZ = useMemo(() => {
    const allRegions = regions ? [...regions.values()] : [];
    return isRegionWith3AZ(allRegions.flat());
  }, [regions]);

  const metaProps = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const filteredRegions = useMemo(
    () =>
      selectedRegionGroup
        ? regions.filter(({ type }) => type === selectedRegionGroup.name)
        : regions,
    [regions, selectedRegionGroup],
  );

  const { data: deploymentAvailability } = usePCIFeatureAvailability(
    DEPLOYMENT_FEATURES,
  );

  const deployments = useMemo<TDeployment[]>(
    () =>
      DEPLOYMENT_MODES_TYPES.filter((mode) => mode !== 'localzone').map(
        (deployment) => ({
          name: deployment,
          comingSoon:
            deploymentAvailability?.get(
              getDeploymentComingSoonKey(deployment),
            ) || false,
        }),
      ),
    [deploymentAvailability],
  );

  const handleSelectRegion = async (region?: TRegion) => {
    store.set.region(null);

    if (region) {
      store.set.region(region);
    }
  };

  return (
    <StepComponent
      title={t('octavia_load_balancer_create_region_title')}
      isOpen={store.steps.get(StepsEnum.REGION).isOpen}
      isChecked={store.steps.get(StepsEnum.REGION).isChecked}
      isLocked={store.steps.get(StepsEnum.REGION).isLocked}
      order={1}
      next={{
        action: () => {
          trackStep(1);

          store.check(StepsEnum.REGION);
          store.lock(StepsEnum.REGION);

          store.open(StepsEnum.SIZE);
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: networks.length === 0,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.REGION);
          store.uncheck(StepsEnum.REGION);
          store.open(StepsEnum.REGION);
          store.reset(
            StepsEnum.SIZE,
            StepsEnum.IP,
            StepsEnum.NETWORK,
            StepsEnum.INSTANCE,
            StepsEnum.NAME,
          );
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <DeploymentTilesInput
        name="deployment"
        value={selectedRegionGroup}
        onChange={setSelectedRegionGroup}
        deployments={deployments}
      />
      <div className="mb-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_create_region_intro')}
          <OsdsLink
            href={
              REGION_AVAILABILITY_LINK[ovhSubsidiary] ||
              REGION_AVAILABILITY_LINK.DEFAULT
            }
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('octavia_load_balancer_create_region_link')}
          </OsdsLink>
        </OsdsText>
      </div>
      <PCICommonContext.Provider value={metaProps}>
        <RegionSelector
          projectId={projectId}
          onSelectRegion={handleSelectRegion}
          regionFilter={(region) =>
            region.isMacro ||
            filteredRegions?.some(({ name }) => name === region.name)
          }
        />
      </PCICommonContext.Provider>
      {isSearchingNetwork && (
        <div className="mt-6">
          <OsdsSpinner inline />
        </div>
      )}
      {store.region && networks.length === 0 && !isSearchingNetwork && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.warning}
          icon={ODS_ICON_NAME.WARNING}
          className="mt-6"
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            <Trans
              t={t}
              i18nKey="octavia_load_balancer_create_private_network"
              components={{
                link: (
                  <Links
                    label={t(
                      'octavia_load_balancer_create_private_network_label',
                    )}
                    href={`${projectUrl}/private-networks/new`}
                  />
                ),
              }}
            />
          </OsdsText>
        </OsdsMessage>
      )}
    </StepComponent>
  );
};
