import {
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GUIDE_URLS, TRACKING_GUIDE_LINKS } from '@/pages/order/constants';
import { useData } from '@/api/hooks/useData';
import { useMe } from '@/api/hooks/useMe';
import { StepIdsEnum, TCountry } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { CountryInputComponent } from '@/components/input/CountryInput.component';

export const FailoverSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t: tOrder } = useTranslation('order');
  const { form, setForm, steps } = useOrderStore();
  const { On } = useActions(projectId);
  const { state: DataState, getInstanceById } = useData(projectId, regionName);
  const { me } = useMe();
  const [instanceCreationURL, setInstanceCreationURL] = useState('');
  const nav = useNavigation();

  useEffect(() => {
    nav
      .getURL('public-cloud', `#/pci/projects/${projectId}/instances/new`, {})
      .then((data) => setInstanceCreationURL(`${data}`));
  }, [projectId, nav]);

  return (
    <>
      <StepComponent
        key={StepIdsEnum.FAILOVER_COUNTRY}
        {...steps.get(StepIdsEnum.FAILOVER_COUNTRY)}
        title={tOrder(
          'pci_additional_ip_create_step_select_region_failover_ip',
        )}
        next={{ action: form.failoverCountry && On.next }}
        onEdit={On.edit}
        order={2}
      >
        <CountryInputComponent
          value={form.failoverCountry}
          countries={DataState.countries}
          onInput={(value: TCountry) =>
            setForm({
              ...form,
              failoverCountry: value,
            })
          }
        />
      </StepComponent>
      <StepComponent
        key={StepIdsEnum.FAILOVER_INSTANCE}
        {...steps.get(StepIdsEnum.FAILOVER_INSTANCE)}
        title={tOrder('pci_additional_ip_create_step_attach_instance')}
        next={{
          action: form.instance && On.next,
          label: tOrder('pci_additional_ips_failoverip_order_generate'),
        }}
        showDisabledAction={true}
        order={3}
      >
        {DataState.instances?.additional.filter((instance) =>
          form.failoverCountry?.regionNames.includes(instance.region),
        ).length !== 0 ? (
          <>
            <OsdsMessage
              icon={ODS_ICON_NAME.INFO}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <p className="text-base font-sans">
                <span
                  className="font-sans no-underline"
                  dangerouslySetInnerHTML={{
                    __html: tOrder(
                      'pci_additional_ip_create_step_attach_instance_info_failover_ip',
                      {
                        guideLink:
                          GUIDE_URLS.CONF_FAILOVER_IP[me?.ovhSubsidiary] ||
                          GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT,
                        trackLabel:
                          TRACKING_GUIDE_LINKS.FAILOVER_IP_CONFIGURATION_GUIDE,
                      },
                    ),
                  }}
                ></span>
              </p>
            </OsdsMessage>
            <div>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {tOrder('pci_additional_ips_failoverip_order_instance')}
              </OsdsText>
            </div>
            <OsdsSelect
              required
              inline
              value={form.instance?.id}
              onOdsValueChange={(event) => {
                setForm({
                  ...form,
                  instance: getInstanceById(event.detail.value as string),
                });
              }}
            >
              <span slot="placeholder">Select an instance</span>
              {DataState.instances?.additional
                .filter((instance) =>
                  form.failoverCountry?.regionNames.includes(instance.region),
                )
                .map((instance) => (
                  <OsdsSelectOption key={instance.id} value={instance.id}>
                    {instance.name}
                  </OsdsSelectOption>
                ))}
            </OsdsSelect>
          </>
        ) : (
          <OsdsMessage
            icon={ODS_ICON_NAME.ERROR_CIRCLE}
            color={ODS_THEME_COLOR_INTENT.error}
          >
            <p>
              <OsdsText
                color={ODS_TEXT_COLOR_INTENT.error}
                size={ODS_TEXT_SIZE._600}
              >
                {tOrder(
                  'pci_additional_ip_create_no_instance_message_failover_ip',
                )}
                &nbsp;
                <span
                  className="font-sans no-underline"
                  dangerouslySetInnerHTML={{
                    __html: tOrder('pci_additional_ip_create_create_instance', {
                      url: instanceCreationURL,
                    }),
                  }}
                ></span>
              </OsdsText>
            </p>
          </OsdsMessage>
        )}
      </StepComponent>
    </>
  );
};
