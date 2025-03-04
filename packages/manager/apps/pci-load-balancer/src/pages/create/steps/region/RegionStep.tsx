import { useMemo } from 'react';
import {
  OsdsLink,
  OsdsMessage,
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
} from '@ovh-ux/manager-pci-common';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import {
  getRegionPrivateNetworksQuery,
  useGetPrivateNetworks,
} from '@/api/hook/useNetwork';
import queryClient from '@/queryClient';

export type TRegionStepProps = {
  regions: TRegion[];
  ovhSubsidiary: string;
  projectId: string;
};

const isRegionWith3AZ = (regions: TRegion[]) =>
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

  const { data: networks } = useGetPrivateNetworks(projectId);

  const isNetworkAvailable = useMemo(
    () =>
      networks?.some((network) =>
        network.regions.some((region) => region.region === store?.region?.name),
      ),
    [networks, store?.region],
  );

  const has3AZ = useMemo(() => {
    const allRegions = regions ? [...regions.values()] : [];
    return isRegionWith3AZ(allRegions.flat());
  }, [regions]);

  const metaProps = usePCICommonContextFactory({ has3AZ });

  const handleSelectRegion = async (region?: TRegion) => {
    store.set.region(null);

    if (region) {
      store.set.region(region);

      // prefetch network for the next step
      await queryClient.prefetchQuery(
        getRegionPrivateNetworksQuery(projectId, region.name),
      );
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
        isDisabled: !isNetworkAvailable,
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
            region.isMacro || regions?.some(({ name }) => name === region.name)
          }
        />
      </PCICommonContext.Provider>
      {store.region?.type === 'region-3-az' && (
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
            {t('octavia_load_balancer_create_region_3az_price')}
          </OsdsText>
        </OsdsMessage>
      )}
      {store.region && !isNetworkAvailable && (
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
