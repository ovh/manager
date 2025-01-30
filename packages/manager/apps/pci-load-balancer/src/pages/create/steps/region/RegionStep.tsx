import { useMemo } from 'react';
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
  useProject,
  usePCICommonContextFactory,
  PCICommonContext,
  TLocalisation,
} from '@ovh-ux/manager-pci-common';
import { TRegion } from '@/api/hook/useRegions';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';

export type TRegionStepProps = {
  isLoading: boolean;
  regions?: Map<string, TRegion[]>;
  ovhSubsidiary: string;
};

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some((region) => region.type === 'region-3-az');

export const RegionStep = ({
  isLoading,
  regions,
  ovhSubsidiary,
}: Readonly<TRegionStepProps>): JSX.Element => {
  const { t } = useTranslation(['load-balancer/create', 'pci-common']);
  const { data: project } = useProject();
  const projectUrl = useProjectUrl('public-cloud');

  const { trackStep } = useTracking();

  const store = useCreateStore();

  const has3AZ = useMemo(() => {
    const allRegions = regions ? [...regions.values()] : [];
    return isRegionWith3AZ(allRegions.flat());
  }, [regions]);

  const metaProps = usePCICommonContextFactory({ has3AZ });

  const handleSelectRegion = (selectedRegion: TLocalisation) => {
    store.set.region(null);
    if (selectedRegion) {
      const region = regions
        ?.get(store.addon?.code)
        ?.find(({ name }) => selectedRegion.name === name);

      store.set.region(region);
    }
  };

  return (
    <StepComponent
      title={t('octavia_load_balancer_create_region_title')}
      isOpen={store.steps.get(StepsEnum.REGION).isOpen}
      isChecked={store.steps.get(StepsEnum.REGION).isChecked}
      isLocked={store.steps.get(StepsEnum.REGION).isLocked}
      order={2}
      next={{
        action: () => {
          trackStep(2);

          store.check(StepsEnum.REGION);
          store.lock(StepsEnum.REGION);

          store.open(StepsEnum.IP);
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !store.region?.isEnabled,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.REGION);
          store.uncheck(StepsEnum.REGION);
          store.open(StepsEnum.REGION);
          store.reset(
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
      {isLoading ? (
        <div className="text-center mt-6">
          <OsdsSpinner inline />
        </div>
      ) : (
        <PCICommonContext.Provider value={metaProps}>
          <RegionSelector
            projectId={project.project_id}
            onSelectRegion={handleSelectRegion}
            regionFilter={(region) =>
              region.isMacro ||
              regions
                ?.get(store.addon?.code)
                ?.some(({ name }) => name === region.name)
            }
          />
        </PCICommonContext.Provider>
      )}
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
      {store.region && !store.region.isEnabled && (
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
