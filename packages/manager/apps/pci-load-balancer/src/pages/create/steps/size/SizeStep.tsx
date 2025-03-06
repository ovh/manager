import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { AGORA_ADDON_FAMILY, PRODUCT_LINK } from '@/constants';
import SizeInputComponent from './input/SizeInput.component';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { useColumnsCount } from '@/pages/create/hooks/useColumnsCount';
import { useRegionAddons } from '@/api/hook/useAddons/useAddons';

export type TSizeStepProps = {
  ovhSubsidiary: string;
  projectId: string;
};

export const SizeStep = ({
  ovhSubsidiary,
  projectId,
}: Readonly<TSizeStepProps>): JSX.Element => {
  const { t } = useTranslation(['load-balancer/create', 'pci-common']);

  const columnsCount = useColumnsCount();

  const { trackStep } = useTracking();

  const store = useCreateStore();

  const { addons } = useRegionAddons({
    ovhSubsidiary,
    projectId,
    region: store.region?.name || '',
    addonFamily: AGORA_ADDON_FAMILY,
  });

  return (
    <StepComponent
      title={t('octavia_load_balancer_create_size_title')}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      order={2}
      next={{
        action: () => {
          trackStep(2);

          store.check(StepsEnum.SIZE);
          store.lock(StepsEnum.SIZE);

          store.open(StepsEnum.IP);
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: store.addon === null,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.SIZE);
          store.uncheck(StepsEnum.SIZE);
          store.open(StepsEnum.SIZE);
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
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('octavia_load_balancer_create_size_intro')}{' '}
        <OsdsLink
          href={PRODUCT_LINK[ovhSubsidiary] || PRODUCT_LINK.DEFAULT}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('octavia_load_balancer_create_size_intro_link')}
        </OsdsLink>
      </OsdsText>
      <SizeInputComponent
        addons={addons}
        value={store.addon}
        onInput={store.set.addon}
        columnsCount={columnsCount}
      />
    </StepComponent>
  );
};
