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
import { useMemo } from 'react';
import { useData } from '@/api/hooks/useData';
import { StepIdsEnum, TRegion } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { FloatingIpSummary } from '@/pages/order/steps/FloatingIpSummary';
import { GUIDE_URLS, TRACKING_GUIDE_LINKS } from '@/pages/order/constants';
import { useMe } from '@/api/hooks/useMe';
import { TileInputComponent } from '@/components/input/TileInput.component';
import { useStepsStore } from '@/pages/order/hooks/useStepsStore';

export const FloatingSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { me } = useMe();
  const { t: tOrder } = useTranslation('order');
  const { t: tRegions } = useTranslation('regions_bis');
  const { t: tStepper } = useTranslation('stepper');
  const { state: DataState, getInstanceById } = useData(projectId, regionName);
  const { form, setForm } = useOrderStore();
  const { items: steps } = useStepsStore();
  const { on } = useActions(projectId);

  const selectedRegionInstances = useMemo(
    () =>
      DataState.instances?.floating.filter(
        (instance) => instance.region === form.floatingRegion?.name,
      ),
    [form.floatingRegion],
  );

  const selectedInstanceIpAddresses = useMemo(
    () =>
      form.instance?.ipAddresses.filter(
        (ipAddress) => ipAddress.type === 'private',
      ),
    [form.instance],
  );

  return (
    <>
      <StepComponent
        key={StepIdsEnum.FLOATING_REGION}
        {...steps.get(StepIdsEnum.FLOATING_REGION)}
        subtitle={
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            color={ODS_TEXT_COLOR_INTENT.text}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: tOrder(
                  'pci_additional_ip_create_step_select_region_description_floating_ip',
                  {
                    guideLink:
                      GUIDE_URLS.REGIONS_AVAILABILITY[me?.ovhSubsidiary] ||
                      GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT,
                    trackLabel:
                      TRACKING_GUIDE_LINKS.FLOATING_IP_REGION_AVAILABILITY,
                  },
                ),
              }}
            ></span>
          </OsdsText>
        }
        next={{
          action: form.floatingRegion && on.next,
          label: tStepper('common_stepper_next_button_label'),
        }}
        edit={{
          action: on.edit,
          label: tStepper('common_stepper_modify_this_step'),
        }}
        order={2}
      >
        <TileInputComponent<TRegion, string, string>
          value={form.floatingRegion}
          items={DataState.regions}
          onInput={(value: TRegion) =>
            setForm({ ...form, floatingRegion: value })
          }
          group={{
            by: (item: TRegion) => item.continent,
            label: (items: TRegion[]) =>
              Object.is(items.length, DataState.regions.length)
                ? tRegions('pci_project_regions_list_continent_all')
                : items[0].continent,
            showAllTab: true,
          }}
          label={(item) => item.microName}
          stack={{
            by: (item: TRegion) => item.macroName,
            label: (item) => item.macroName,
            title: tRegions('pci_project_regions_list_region'),
          }}
        />
      </StepComponent>
      <StepComponent
        key={StepIdsEnum.FLOATING_INSTANCE}
        {...steps.get(StepIdsEnum.FLOATING_INSTANCE)}
        next={{
          action: form.instance && on.next,
          label: tStepper('common_stepper_next_button_label'),
        }}
        order={3}
      >
        {selectedRegionInstances.length !== 0 ? (
          <>
            <p>
              <OsdsText>
                {tOrder(
                  'pci_additional_ip_create_step_attach_instance_description_floating_ip',
                )}
              </OsdsText>
            </p>
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
              <span slot="placeholder">
                {tOrder('pci_additional_ip_create_step_attach_instance_label')}
              </span>
              {selectedRegionInstances.map((instance) => (
                <OsdsSelectOption key={instance.id} value={instance.id}>
                  {instance.name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
            {form.instance && (
              <>
                <div>
                  <OsdsText>
                    {tOrder('pci_additional_ip_select_network_label')}
                  </OsdsText>
                </div>
                <OsdsSelect
                  required
                  value={form.ipAddress?.ip}
                  onOdsValueChange={(event) => {
                    setForm({
                      ...form,
                      ipAddress: form.instance.ipAddresses.find(
                        (ipAddress) =>
                          ipAddress.ip === (event.detail.value as string),
                      ),
                    });
                  }}
                >
                  <span slot="placeholder">
                    {tOrder('pci_additional_ip_select_network_label')}
                  </span>
                  {selectedInstanceIpAddresses.map((ipAddress) => (
                    <OsdsSelectOption key={ipAddress.ip} value={ipAddress.ip}>
                      {ipAddress.ip}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              </>
            )}
          </>
        ) : (
          <OsdsMessage
            icon={ODS_ICON_NAME.ERROR_CIRCLE}
            color={ODS_THEME_COLOR_INTENT.error}
            className="rounded-[8px]"
          >
            <p className="text-base font-sans">
              {tOrder(
                'pci_additional_ip_create_no_instance_message_floating_ip',
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: tOrder('pci_additional_ip_create_create_instance', {
                    url: `/pci/projects/${projectId}/instances/new`,
                  }),
                }}
              ></span>
            </p>
          </OsdsMessage>
        )}
      </StepComponent>
      <StepComponent
        key={StepIdsEnum.FLOATING_SUMMARY}
        {...steps.get(StepIdsEnum.FLOATING_SUMMARY)}
        next={{
          action: on.next,
          label: tStepper('common_stepper_next_button_label'),
        }}
        order={4}
      >
        <FloatingIpSummary
          projectId={projectId}
          ipRegion={form.floatingRegion?.name}
          networkId={form.ipAddress?.networkId}
          onSelectedSizeChanged={(selectedSize: string) =>
            setForm({
              ...form,
              floatingGatewaySize: selectedSize,
            })
          }
        />
      </StepComponent>
    </>
  );
};
