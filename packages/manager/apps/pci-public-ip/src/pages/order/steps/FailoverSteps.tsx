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
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { GUIDE_URLS, TRACKING_GUIDE_LINKS } from '@/pages/order/constants';
import { useData } from '@/api/hooks/useData';
import { useMe } from '@/api/hooks/useMe';
import { StepIdsEnum, TCountry } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { useTrackTranslationLink } from '@/hooks/useTrackTranslationLink';
import { TileInputComponent } from '@/components/input/TileInput.component';
import { useStepsStore } from '@/pages/order/hooks/useStepsStore';

export const FailoverSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t: tOrder } = useTranslation('order');
  const { t: tCountries } = useTranslation('countries');
  const { t: tStepper } = useTranslation('stepper');
  const { form, setForm } = useOrderStore();
  const { items: steps } = useStepsStore();
  const { on } = useActions(projectId);
  const { state: DataState, getInstanceById } = useData(projectId, regionName);
  const { me } = useMe();

  const trackRef = useRef<HTMLElement>(null);

  useTrackTranslationLink(trackRef);

  return (
    <>
      <StepComponent
        key={StepIdsEnum.FAILOVER_COUNTRY}
        {...steps.get(StepIdsEnum.FAILOVER_COUNTRY)}
        subtitle={
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            color={ODS_TEXT_COLOR_INTENT.text}
          >
            <span
              ref={trackRef}
              dangerouslySetInnerHTML={{
                __html: tOrder(
                  'pci_additional_ip_create_step_select_region_description_failover_ip',
                  {
                    guideLink:
                      GUIDE_URLS.FAILOVER_IP[me?.ovhSubsidiary] ||
                      GUIDE_URLS.FAILOVER_IP.DEFAULT,
                    trackLabel: TRACKING_GUIDE_LINKS.DISCOVER_FAILOVER_IP,
                  },
                ),
              }}
            ></span>
          </OsdsText>
        }
        next={{
          action: form.failoverCountry && on.next,
          label: tStepper('common_stepper_next_button_label'),
        }}
        edit={{
          action: on.edit,
          label: tStepper('common_stepper_modify_this_step'),
        }}
        order={2}
      >
        <TileInputComponent<TCountry, string, string>
          value={form.failoverCountry}
          items={DataState.countries}
          label={(item: TCountry) =>
            tCountries(`pci_additional_ips_country_${item.name}`)
          }
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
        next={{
          action: form.instance && on.next,
          label: 'Generate purchase order',
        }}
        order={3}
      >
        {DataState.instances?.additional.filter((instance) =>
          form.failoverCountry?.regionNames.includes(instance.region),
        ).length !== 0 ? (
          <>
            <OsdsMessage
              icon={ODS_ICON_NAME.INFO}
              color={ODS_THEME_COLOR_INTENT.primary}
              className="rounded-[8px]"
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
              <OsdsText>
                {tOrder('pci_additional_ips_failoverip_order_instance')}
              </OsdsText>
            </div>
            <OsdsSelect
              required
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
            className="rounded-[8px]"
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
                      url: `/pci/projects/${projectId}/instances/new`,
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
