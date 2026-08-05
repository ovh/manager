import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  DeploymentTilesInput,
  PCICommonContext,
  RegionSelector,
  TDeployment,
  TLocalisation,
  usePCICommonContextFactory,
} from '@ovh-ux/manager-pci-common';
import {
  Links,
  LinksProps,
  Subtitle,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useData } from '@/api/hooks/useData';
import { useBasicIpCatalog } from '@/api/hooks/useBasicIpCatalog';
import { useBasicIpDeployments } from '@/api/hooks/useBasicIpDeployments';
import { RegionType, StepIdsEnum, TRegion } from '@/api/types';
import { useOrderStore } from '@/hooks/order/useStore';
import { useActions } from '@/hooks/order/useActions';
import { StepComponent } from '@/components/container/Step.component';
import TileLabel from '@/components/tile/TileLabel.component';
import PriceLabel from '@/components/PriceLabel.component';

const MessageLink: FC<PropsWithChildren<LinksProps>> = ({
  children,
  ...props
}) => <Links label={children} {...props} />;

export const BasicSteps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t } = useTranslation(['order', 'regions', 'common']);
  const { form, setForm, steps } = useOrderStore();
  const { On } = useActions(projectId);
  const { state: orderData, getInstanceById, isInstanceFetching } = useData(
    projectId,
    regionName,
  );
  const {
    regionNames,
    getRegionPrice,
    isFetching: isCatalogFetching,
  } = useBasicIpCatalog(projectId);

  const [instanceCreationURL, setInstanceCreationURL] = useState('');
  const nav = useNavigation();

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  useEffect(() => {
    nav
      .getURL('public-cloud', `#/pci/projects/${projectId}/instances/new`, {})
      .then((data) => setInstanceCreationURL(`${data}`));
  }, [projectId, nav]);

  const selectedRegionInstances = useMemo(
    () =>
      orderData.instances?.all.filter(
        (instance) => instance.region === form.basicRegion?.name,
      ),
    [form.basicRegion, orderData.instances?.all],
  );

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const deploymentModes = useBasicIpDeployments(projectId);

  const deployments = useMemo<TDeployment[]>(
    () =>
      deploymentModes.map((deployment) => ({
        ...deployment,
        price: (
          <PriceLabel
            value={getFormattedHourlyCatalogPrice(deployment.price as number)}
          />
        ),
      })),
    [deploymentModes, getFormattedHourlyCatalogPrice],
  );

  const has3AZ = deploymentModes.some(({ name }) => name === RegionType['3AZ']);
  const metaProps = usePCICommonContextFactory({ has3AZ });

  const isRegionInSelectedGroup = useCallback(
    (region: TLocalisation) =>
      !selectedRegionGroup || region.type === selectedRegionGroup.name,
    [selectedRegionGroup],
  );

  const onSelectRegion = useCallback(
    (region: TLocalisation) => {
      // to reset the previous selection if the region is Macro
      if (!region) {
        setForm({ ...form, basicRegion: null });
        return;
      }

      const basicRegion: TRegion = {
        continent: region.continentLabel,
        continentCode: region.continentCode,
        datacenter: region.datacenterLocation,
        enabled: region.status === 'UP',
        macroName: region.macroLabel,
        microName: region.microLabel,
        name: region.name,
        type: region.type as RegionType,
      };

      setForm({ ...form, basicRegion });
    },
    [form, setForm],
  );

  return (
    <>
      <StepComponent
        key={StepIdsEnum.BASIC_REGION}
        {...steps.get(StepIdsEnum.BASIC_REGION)}
        title={t('regions:pci_project_regions_list_region')}
        next={
          form.basicRegion && selectedRegionInstances.length !== 0
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
            {t('pci_additional_ip_create_step_select_region_basic_ip')}
          </Subtitle>
          <PCICommonContext.Provider value={metaProps}>
            <RegionSelector
              projectId={projectId}
              onSelectRegion={onSelectRegion}
              regionFilter={(region) =>
                region.isMacro ||
                (regionNames.includes(region.name) &&
                  isRegionInSelectedGroup(region))
              }
            />
          </PCICommonContext.Provider>
          {((form.basicRegion && selectedRegionInstances.length === 0) ||
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
                  i18nKey="pci_additional_ip_create_no_instance_message_basic_ip"
                  components={{
                    Link: <MessageLink href={instanceCreationURL} />,
                  }}
                />
              </OsdsText>
            </OsdsMessage>
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
            key={StepIdsEnum.BASIC_INSTANCE}
            {...steps.get(StepIdsEnum.BASIC_INSTANCE)}
            title={t('pci_additional_ip_create_step_attach_instance')}
            next={{ action: form.instance && On.next }}
            onEdit={On.edit}
            order={3}
          >
            <>
              <p>
                <OsdsText>
                  {t(
                    'pci_additional_ip_create_step_attach_instance_description_basic_ip',
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
            </>
          </StepComponent>
          <StepComponent
            key={StepIdsEnum.BASIC_SUMMARY}
            {...steps.get(StepIdsEnum.BASIC_SUMMARY)}
            title={t('pci_additional_ip_create_step_summary')}
            order={4}
          >
            <div>
              <OsdsTile
                color={ODS_THEME_COLOR_INTENT.primary}
                className="mb-6"
                inline
              >
                <TileLabel title={t('pci_floating_ip_resume_hour')}>
                  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                    <strong>{t('pci_floating_ip_resume_price')}</strong>
                    <PriceLabel
                      value={getFormattedHourlyCatalogPrice(
                        getRegionPrice(form.basicRegion?.name),
                      )}
                      isLoading={isCatalogFetching}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                      className="font-normal"
                    />
                  </OsdsText>
                </TileLabel>
              </OsdsTile>
              {form.isSubmitting && (
                <div>
                  <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline />
                </div>
              )}
              <div className="mt-6">
                <OsdsButton
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="w-fit"
                  {...(form.isSubmitting && { disabled: true })}
                  onClick={() => On.next(StepIdsEnum.BASIC_SUMMARY)}
                >
                  {t('pci_additional_ip_creating_basic_ip')}
                </OsdsButton>
              </div>
            </div>
          </StepComponent>
        </>
      )}
    </>
  );
};
