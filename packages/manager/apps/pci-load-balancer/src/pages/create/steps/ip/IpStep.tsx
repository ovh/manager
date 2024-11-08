import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { TFloatingIp } from '@/api/data/floating-ips';
import { TPrivateNetwork } from '@/api/data/network';
import { defaultFloatingIps } from '@/api/hook/useFloatingIps';
import { IpStepMessages } from '@/pages/create/steps/ip/IpStepMessages';
import { AGORA_FLOATING_IP_REGEX } from '@/constants';

export type TIpStepProps = {
  floatingIps: TFloatingIp[];
  privateNetworksList: TPrivateNetwork[];
  catalog: TCatalog;
  isLoading: boolean;
};

export const IpStep = ({
  floatingIps,
  privateNetworksList,
  catalog,
  isLoading,
}: TIpStepProps): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');
  const { t: tCommon } = useTranslation('pci-common');

  const { trackStep } = useTracking();

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const store = useCreateStore();

  const floatingIpsList = useMemo(
    () => [
      ...defaultFloatingIps.map((floatingIp) => ({
        ...floatingIp,
        ip: tCreate(floatingIp.ip),
      })),
      ...floatingIps,
    ],
    [floatingIps],
  );

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_floating_ip_title')}
      isOpen={store.steps.get(StepsEnum.IP).isOpen}
      isChecked={store.steps.get(StepsEnum.IP).isChecked}
      isLocked={store.steps.get(StepsEnum.IP).isLocked}
      order={3}
      next={{
        action: () => {
          trackStep(3);

          store.check(StepsEnum.IP);
          store.lock(StepsEnum.IP);

          if (privateNetworksList.length > 0) {
            store.set.privateNetwork(privateNetworksList[0]);
          }

          store.open(StepsEnum.NETWORK);
        },
        label: tCommon('common_stepper_next_button_label'),
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.IP);
          store.uncheck(StepsEnum.IP);
          store.open(StepsEnum.IP);
          store.reset(StepsEnum.NETWORK, StepsEnum.INSTANCE, StepsEnum.NAME);
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
        {tCreate('octavia_load_balancer_create_floating_ip_intro')}
      </OsdsText>
      {isLoading ? (
        <div>
          <OsdsSpinner inline />
        </div>
      ) : (
        <OsdsFormField className="mt-8" inline>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.subheading}
            slot="label"
          >
            {tCreate('octavia_load_balancer_create_floating_ip_field')}
          </OsdsText>
          <OsdsSelect
            className="w-[20rem]"
            value={store.publicIp?.id}
            error={false}
            onOdsValueChange={(event) => {
              const targetIp = floatingIpsList.find(
                (ip) => ip.id === event.target.value,
              );
              store.set.publicIp(targetIp);
            }}
            inline
            {...(floatingIpsList.length === 0 ? { disabled: true } : {})}
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
              slot="placeholder"
            >
              {tCreate('octavia_load_balancer_create_floating_ip_field')}
            </OsdsText>
            {floatingIpsList.map((ip) => (
              <OsdsSelectOption value={ip.id} key={ip.id}>
                {ip.ip}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}
      {['create', 'none'].includes(store.publicIp?.type) && (
        <IpStepMessages
          type={store.publicIp?.type}
          price={
            store.publicIp?.type === 'create'
              ? getFormattedHourlyCatalogPrice(
                  catalog?.addons.filter((addon) =>
                    addon.planCode.match(AGORA_FLOATING_IP_REGEX),
                  )[0].pricings[0].price,
                )?.split('/')[0]
              : undefined
          }
        />
      )}
    </StepComponent>
  );
};
