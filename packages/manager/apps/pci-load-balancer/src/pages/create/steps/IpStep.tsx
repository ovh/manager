import {
  OsdsFormField,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { AGORA_FLOATING_IP_REGEX } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { useGetRegionPrivateNetworks } from '@/api/hook/useNetwork';
import { useFloatingIpsList } from '@/api/hook/useFloatingIpsList';

export const IpStep = (): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');
  const { t: tCommon } = useTranslation('pci-common');

  const { trackStep } = useTracking();
  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const { projectId } = useParams();

  const store = useCreateStore();

  const {
    data: floatingIpsList,
    isPending: isFloatingIpsPending,
  } = useFloatingIpsList(projectId, store.region?.name);

  const { list: privateNetworksList } = useGetRegionPrivateNetworks(
    projectId,
    store.region?.name,
  );

  const { data: catalog } = useCatalog();

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
      {isFloatingIpsPending ? (
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
      {store.publicIp?.id === 'create' && (
        <OsdsMessage
          className="mt-8"
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
        >
          <div className="grid grid-cols-1 gap-8 py-6">
            <div>
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tCreate(
                  'octavia_load_balancer_create_floating_ip_new_information',
                )}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tCreate(
                      'octavia_load_balancer_create_floating_ip_new_price',
                      {
                        price: `
                          <b>
                            ${
                              getFormattedHourlyCatalogPrice(
                                catalog?.addons.filter((addon) =>
                                  addon.planCode.match(AGORA_FLOATING_IP_REGEX),
                                )[0].pricings[0].price,
                              )?.split('/')[0]
                            }
                          </b>
                        `,
                      },
                    ),
                  }}
                ></span>
                {tCreate(
                  'octavia_load_balancer_create_floating_ip_new_price_interval',
                )}
              </OsdsText>
            </div>
          </div>
        </OsdsMessage>
      )}
      {store.publicIp?.id === 'none' && (
        <OsdsMessage
          className="mt-10"
          type={ODS_MESSAGE_TYPE.warning}
          color={ODS_THEME_COLOR_INTENT.warning}
        >
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate(
              'octavia_load_balancer_create_floating_ip_no_floating_ip_information',
            )}
          </OsdsText>
        </OsdsMessage>
      )}
    </StepComponent>
  );
};
