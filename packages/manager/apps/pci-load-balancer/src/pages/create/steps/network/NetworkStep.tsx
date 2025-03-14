import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { SubnetNetworksPart } from '@/pages/create/steps/network/parts/SubnetNetworks.part';
import { PrivateNetworkPart } from '@/pages/create/steps/network/parts/PrivateNetwork.part';
import { FloatingIpSelectionId } from '@/types/floating.type';

export const NetworkStep = (): JSX.Element => {
  const { t } = useTranslation(['load-balancer/create', 'pci-common']);

  const store = useCreateStore();

  const { trackStep } = useTracking();

  return (
    <StepComponent
      title={t('octavia_load_balancer_create_private_network_title')}
      isOpen={store.steps.get(StepsEnum.NETWORK).isOpen}
      isChecked={store.steps.get(StepsEnum.NETWORK).isChecked}
      isLocked={store.steps.get(StepsEnum.NETWORK).isLocked}
      order={4}
      next={{
        action: () => {
          trackStep(4);

          store.check(StepsEnum.NETWORK);
          store.lock(StepsEnum.NETWORK);

          store.open(StepsEnum.INSTANCE);
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled:
          !store.subnet && store.publicIp !== FloatingIpSelectionId.UNATTACHED,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.NETWORK);
          store.uncheck(StepsEnum.NETWORK);
          store.open(StepsEnum.NETWORK);
          store.reset(StepsEnum.INSTANCE, StepsEnum.NAME);
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-4"
      >
        {t('octavia_load_balancer_create_private_network_intro')}
      </OsdsText>
      <PrivateNetworkPart />
      <SubnetNetworksPart />
    </StepComponent>
  );
};
