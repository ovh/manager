import {
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Links } from '@ovh-ux/manager-react-components';
import {
  RegionSelector,
  usePCICommonContextFactory,
  PCICommonContext,
  TLocalisation,
  TDeployment,
  DeploymentTilesInput,
  usePCIFeatureAvailability,
  getDeploymentComingSoonKey,
  DEPLOYMENT_FEATURES,
  DEPLOYMENT_MODES_TYPES,
} from '@ovh-ux/manager-pci-common';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/api/hooks/useData';
import { RegionType, StepIdsEnum, TRegion } from '@/api/types';
import { useOrderStore } from '@/hooks/order/useStore';
import { useActions } from '@/hooks/order/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { FloatingIpSummary } from '@/pages/order/steps/FloatingIpSummary';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some((region) => region.type === RegionType['3AZ']);

const GuideLink = ({
  children,
  href,
}: Readonly<{ href: string; children?: string }>) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
  />
);

export const FloatingSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t } = useTranslation(['order', 'common']);
  const { state: DataState, getInstanceById } = useData(projectId, regionName);
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
      DataState.instances?.floating.filter(
        (instance) => instance.region === form.floatingRegion?.name,
      ),
    [form.floatingRegion, DataState.instances?.floating],
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

  const has3AZ = isRegionWith3AZ(DataState.regions);
  const metaProps = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const regions = useMemo(
    () =>
      selectedRegionGroup
        ? DataState.regions.filter(
            ({ type }) => type === selectedRegionGroup.name,
          )
        : DataState.regions,
    [DataState, selectedRegionGroup],
  );

  const { data: deploymentAvailability } = usePCIFeatureAvailability(
    DEPLOYMENT_FEATURES,
  );

  const deployments = useMemo<TDeployment[]>(
    () =>
      DEPLOYMENT_MODES_TYPES.filter((mode) => mode !== RegionType.LZ).map(
        (deployment) => ({
          name: deployment,
          comingSoon:
            deploymentAvailability?.get(
              getDeploymentComingSoonKey(deployment),
            ) || false,
        }),
      ),
    [deploymentAvailability],
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
        title={t('pci_additional_ip_create_step_select_region_floating_ip')}
        next={{ action: form.floatingRegion && On.next }}
        onEdit={On.edit}
        order={2}
      >
        <DeploymentTilesInput
          name="deployment"
          value={selectedRegionGroup}
          onChange={setSelectedRegionGroup}
          deployments={deployments}
        />
        <PCICommonContext.Provider value={metaProps}>
          <RegionSelector
            projectId={projectId}
            onSelectRegion={onSelectRegion}
            regionFilter={(region) =>
              region.isMacro || regions.some(({ name }) => name === region.name)
            }
          />
        </PCICommonContext.Provider>
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
                  Link: <GuideLink href={guides['3AZ']} />,
                }}
              />
            </OsdsText>
          </div>
        )}
      </StepComponent>
      <StepComponent
        key={StepIdsEnum.FLOATING_INSTANCE}
        {...steps.get(StepIdsEnum.FLOATING_INSTANCE)}
        title={t('pci_additional_ip_create_step_attach_instance')}
        next={{ action: form.instance && form.ipAddress && On.next }}
        order={3}
      >
        {selectedRegionInstances.length !== 0 ? (
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
                  instance: getInstanceById(event.detail.value as string),
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
                          ipAddress.ip === (event.detail.value as string),
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
        ) : (
          <OsdsMessage
            icon={ODS_ICON_NAME.ERROR_CIRCLE}
            color={ODS_THEME_COLOR_INTENT.error}
          >
            <p className="text-base font-sans">
              {t('pci_additional_ip_create_no_instance_message_floating_ip')}{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: t('pci_additional_ip_create_create_instance', {
                    url: instanceCreationURL,
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
  );
};
