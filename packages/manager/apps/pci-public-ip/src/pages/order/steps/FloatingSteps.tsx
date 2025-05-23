import {
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  RegionSelector,
  usePCICommonContextFactory,
  PCICommonContext,
  TLocalisation,
  TDeployment,
  DeploymentTilesInput,
} from '@ovh-ux/manager-pci-common';
import {
  Subtitle,
  Links,
  LinksProps,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation, Trans } from 'react-i18next';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import { useData } from '@/api/hooks/useData';
import { RegionType, StepIdsEnum, TRegion } from '@/api/types';
import { useOrderStore } from '@/hooks/order/useStore';
import { useActions } from '@/hooks/order/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { FloatingIpSummary } from '@/pages/order/steps/FloatingIpSummary';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';
import PriceLabel from '@/components/PriceLabel.component';
import { useDeployments } from '@/api/hooks/useDeployments/useDeployments';

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some((region) => region.type === RegionType['3AZ']);

const MessageLink: FC<PropsWithChildren<LinksProps>> = ({
  children,
  ...props
}) => <Links label={children} {...props} />;

export const FloatingSteps = ({
  projectId,
  regionName,
  instanceId,
}: {
  projectId: string;
  regionName: string;
  instanceId?: string;
}): JSX.Element => {
  const { t } = useTranslation(['order', 'regions', 'common']);
  const { state: orderData, getInstanceById, isInstanceFetching } = useData(
    projectId,
    regionName,
  );
  const { form, setForm, steps } = useOrderStore();
  const [instanceCreationURL, setInstanceCreationURL] = useState('');
  const { On } = useActions(projectId);
  const nav = useNavigation();
  const guides = useGuideLink();

  useEffect(() => {
    nav
      .getURL('public-cloud', `#/pci/projects/${projectId}/instances/new`, {})
      .then((data) => setInstanceCreationURL(`${data}`));
  }, [projectId, nav]);

  const selectedRegionInstances = useMemo(
    () =>
      orderData.instances?.floating.filter((instance) =>
        instanceId
          ? instance.id === instanceId
          : instance.region === form.floatingRegion?.name,
      ),
    [form.floatingRegion, orderData.instances?.floating, instanceId],
  );

  const selectedInstanceIpAddresses = useMemo(
    () =>
      form.instance?.ipAddresses.filter(
        (ipAddress) => ipAddress.type === 'private',
      ),
    [form.instance],
  );

  useEffect(() => {
    if (selectedInstanceIpAddresses?.length) {
      setForm({
        ...form,
        ipAddress: form.instance.ipAddresses.find(
          (ipAddress) => ipAddress.ip === selectedInstanceIpAddresses[0].ip,
        ),
      });
    }
  }, [selectedInstanceIpAddresses]);

  const has3AZ = isRegionWith3AZ(orderData.regions);
  const metaProps = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const regions = useMemo(
    () =>
      selectedRegionGroup
        ? orderData.regions.filter(
            ({ type }) => type === selectedRegionGroup.name,
          )
        : orderData.regions,
    [orderData, selectedRegionGroup],
  );

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const deploymentModes = useDeployments(projectId);

  const deployments = useMemo<TDeployment[]>(
    () =>
      deploymentModes.map((deployment) => ({
        ...deployment,
        price: (
          <PriceLabel
            value={getFormattedHourlyCatalogPrice(deployment.price)}
          />
        ),
      })),
    [deploymentModes],
  );

  const onSelectRegion = useCallback(
    (region: TLocalisation) => {
      // to reset the previews selection if the region is Macro
      setForm({ ...form, floatingRegion: null });

      if (region) {
        const {
          continentLabel: continent,
          continentCode,
          datacenterLocation: datacenter,
          status,
          macroLabel: macroName,
          microLabel: microName,
          name,
        } = region;

        const floatingRegion: TRegion = {
          continent,
          continentCode,
          datacenter,
          enabled: status === 'UP',
          macroName,
          microName,
          name,
          type: region.type as RegionType,
        };

        setForm({ ...form, floatingRegion });
      }
    },
    [form, setForm],
  );

  return (
    <>
      <StepComponent
        key={StepIdsEnum.FLOATING_REGION}
        {...steps.get(StepIdsEnum.FLOATING_REGION)}
        title={t('regions:pci_project_regions_list_region')}
        next={
          form.floatingRegion && selectedRegionInstances.length !== 0
            ? { action: On.next }
            : {}
        }
        showDisabledAction
        onEdit={On.edit}
        order={2}
      >
        <DeploymentTilesInput
          name="deployment"
          value={selectedRegionGroup}
          onChange={setSelectedRegionGroup}
          deployments={deployments}
        />
        <div className="flex flex-col gap-y-4">
          <Subtitle>
            {t('pci_additional_ip_create_step_select_region_floating_ip')}
          </Subtitle>
          <PCICommonContext.Provider value={metaProps}>
            <RegionSelector
              projectId={projectId}
              onSelectRegion={onSelectRegion}
              regionFilter={(region) =>
                region.isMacro ||
                regions.some(({ name }) => name === region.name)
              }
            />
          </PCICommonContext.Provider>
          {((form.floatingRegion && selectedRegionInstances.length === 0) ||
            isInstanceFetching) && (
            <OsdsMessage
              color={ODS_THEME_COLOR_INTENT.warning}
              type={ODS_MESSAGE_TYPE.warning}
              className="mt-4"
            >
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <Trans
                  t={t}
                  i18nKey="pci_additional_ip_create_no_instance_message_floating_ip"
                  components={{
                    Link: <MessageLink href={instanceCreationURL} />,
                  }}
                />
              </OsdsText>
            </OsdsMessage>
          )}
          {form.floatingRegion?.type === RegionType['3AZ'] && (
            <div className="mt-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
              >
                <Trans
                  t={t}
                  i18nKey="pci_floating_ip_3az_guide_description"
                  components={{
                    Link: (
                      <MessageLink
                        href={guides['3AZ']}
                        target={OdsHTMLAnchorElementTarget._blank}
                      />
                    ),
                  }}
                />
              </OsdsText>
            </div>
          )}
        </div>
      </StepComponent>
      {isInstanceFetching ? (
        <div className="text-center mt-4">
          <OsdsSpinner inline />
        </div>
      ) : (
        <>
          <StepComponent
            key={StepIdsEnum.FLOATING_INSTANCE}
            {...steps.get(StepIdsEnum.FLOATING_INSTANCE)}
            title={t('pci_additional_ip_create_step_attach_instance')}
            next={{ action: form.instance && form.ipAddress && On.next }}
            onEdit={On.edit}
            order={3}
          >
            <>
              <p>
                <OsdsText>
                  {t(
                    'pci_additional_ip_create_step_attach_instance_description_floating_ip',
                  )}
                </OsdsText>
              </p>
              <div>
                <OsdsText>
                  {t('pci_additional_ips_failoverip_order_instance')}
                </OsdsText>
              </div>
              <OsdsSelect
                className="mb-4"
                required
                value={form.instance?.id}
                onOdsValueChange={(event) => {
                  setForm({
                    ...form,
                    instance: getInstanceById(String(event.detail.value)),
                  });
                }}
              >
                <span slot="placeholder">
                  {t('pci_additional_ip_create_step_attach_instance_label')}
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
                      {t('pci_additional_ip_select_network_label')}
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
                            ipAddress.ip === String(event.detail.value),
                        ),
                      });
                    }}
                  >
                    <span slot="placeholder">
                      {t('pci_additional_ip_select_network_label')}
                    </span>
                    {selectedInstanceIpAddresses.map((ipAddress, idx) => (
                      <OsdsSelectOption key={idx} value={ipAddress.ip}>
                        {ipAddress.ip}
                      </OsdsSelectOption>
                    ))}
                  </OsdsSelect>
                </>
              )}
            </>
          </StepComponent>
          <StepComponent
            key={StepIdsEnum.FLOATING_SUMMARY}
            {...steps.get(StepIdsEnum.FLOATING_SUMMARY)}
            title={t('pci_additional_ip_create_step_summary')}
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
      )}
    </>
  );
};
