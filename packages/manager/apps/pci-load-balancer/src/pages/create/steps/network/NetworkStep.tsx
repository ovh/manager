import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { FLOATING_IP_TYPE } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { SubnetNetworksPart } from '@/pages/create/steps/network/parts/SubnetNetworks.part';
import { PrivateNetworkPart } from '@/pages/create/steps/network/parts/PrivateNetwork.part';
import { TSubnet } from '@/api/data/network';

export type TNetworkStepProps = {
  subnetsList: TSubnet[];
  isLoading: boolean;
};
export const NetworkStep = ({
  subnetsList,
  isLoading,
}: Readonly<TNetworkStepProps>): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const store = useCreateStore();

  const { trackStep } = useTracking();

  useEffect(() => {
    store.set.subnet(subnetsList.length ? subnetsList[0] : null);
  }, [subnetsList]);

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_private_network_title')}
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
        label: tCommon('common_stepper_next_button_label'),
        isDisabled:
          subnetsList.length === 0 &&
          store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.NETWORK);
          store.uncheck(StepsEnum.NETWORK);
          store.open(StepsEnum.NETWORK);
          store.reset(StepsEnum.INSTANCE, StepsEnum.NAME);
        },
        label: tCommon('common_stepper_modify_this_step'),
      }}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-4"
      >
        {tCreate('octavia_load_balancer_create_private_network_intro')}
      </OsdsText>
      <PrivateNetworkPart />

      {isLoading ? (
        <div>
          <OsdsSpinner inline />
        </div>
      ) : (
        <SubnetNetworksPart />
      )}
    </StepComponent>
  );
};
