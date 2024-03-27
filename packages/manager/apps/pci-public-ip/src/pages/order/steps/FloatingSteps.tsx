import {
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useData } from '@/api/hooks/useData';
import { StepIdsEnum, TRegion } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { RegionInputComponent } from '@/components/input/RegionInput.component';
import { FloatingIpSummary } from '@/pages/order/steps/FloatingIpSummary';

export const FloatingSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t: tOrder } = useTranslation('order');
  const { state: DataState, getInstanceById } = useData(projectId, regionName);
  const { form, setForm, steps } = useOrderStore();
  const { On } = useActions(projectId);

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
        next={{ action: form.floatingRegion && On.next }}
        onEdit={On.edit}
        order={2}
      >
        <RegionInputComponent
          regions={DataState.regions}
          value={form.floatingRegion}
          onInput={(value: TRegion) =>
            setForm({ ...form, floatingRegion: value })
          }
        />
      </StepComponent>
      <StepComponent
        key={StepIdsEnum.FLOATING_INSTANCE}
        {...steps.get(StepIdsEnum.FLOATING_INSTANCE)}
        next={{ action: form.instance && On.next }}
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
        next={{ action: On.next }}
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
