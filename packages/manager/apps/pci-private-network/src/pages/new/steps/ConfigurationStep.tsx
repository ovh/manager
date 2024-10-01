import {
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation, Trans } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsQuantity,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useGatewayByRegion } from '@/api/hooks/useGateway';
import { useAggregatedNonLocalNetworks } from '@/api/hooks/useNetwork';
import { useProductAvailability } from '@/api/hooks/useProductAvailability';
import {
  DEFAULT_IP,
  DEFAULT_VLAN_ID,
  GATEWAY_HOURLY_PLAN_CODE,
  GUIDE_LINKS,
  VLAN_ID,
} from '@/constants';
import { TMappedRegion } from './LocalizationStep';
import { TAggregatedNetwork } from '@/api/data/network';
import { useProjectAvailableRegions } from '@/api/hooks/useRegions';
import {
  DEFAULT_FORM_STATE,
  StepsEnum,
  useNewNetworkStore,
} from '@/pages/new/store';
import { isValidCidrMask, isValidIpAddress } from '@/api/utils/utils';

const isVlanAvailable = (
  networks: TAggregatedNetwork[],
  vlanIdToCheck: number,
) => networks?.every(({ vlanId }) => vlanId !== vlanIdToCheck);

const regenerateNetworkAddress = (vlanId: number) =>
  DEFAULT_IP.replace('{vlanId}', `${vlanId % 255}`);

const getNextAvailableVlanId = (networks: TAggregatedNetwork[]) => {
  const network = networks.find(
    ({ vlanId }) =>
      vlanId !== DEFAULT_VLAN_ID &&
      !networks.some(({ vlanId: nextId }) => nextId === vlanId + 1),
  );

  return network ? network.vlanId + 1 : DEFAULT_VLAN_ID;
};

const isNotLocalZone = (region: TMappedRegion) => {
  if (!region) return false;
  return !region.isLocalZone;
};

export default function ConfigurationStep({
  onCreate,
}: {
  onCreate: () => void;
}): JSX.Element {
  const store = useNewNetworkStore();
  const { clearNotifications } = useNotifications();

  const { t } = useTranslation(['common', 'new']);

  const {
    data: regions,
    isLoading: isRegionsLoading,
  } = useProjectAvailableRegions(store.project?.id);

  const [isGatewayAvailableInRegion, setIsGatewayAvailableInRegion] = useState(
    false,
  );
  const [isNetworkNameInputTouched, setIsNetworkNameInputTouched] = useState(
    false,
  );

  const { projectId } = useParams();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const PRIVATE_NETWORK_URL =
    GUIDE_LINKS.PRIVATE_NETWORK_WITH_GATEWAY[ovhSubsidiary] ||
    GUIDE_LINKS.PRIVATE_NETWORK_WITH_GATEWAY.DEFAULT;

  const REGION_GUIDE_URL =
    GUIDE_LINKS.REGION_AVAILABILITY[ovhSubsidiary] ||
    GUIDE_LINKS.REGION_AVAILABILITY.DEFAULT;

  // TODO: verify rerender
  const VLAN_GUIDE_URL =
    GUIDE_LINKS.VLAN[ovhSubsidiary] || GUIDE_LINKS.VLAN.DEFAULT;

  // To check isGatewayAvailableInRegion
  const { data: productAvailability } = useProductAvailability(
    projectId,
    ovhSubsidiary,
    GATEWAY_HOURLY_PLAN_CODE,
  );

  /**
   * Fetch Gateway by region
   * Condition: When the region is not a localZone
   */
  const { data: gateways } = useGatewayByRegion(
    projectId,
    store.form?.region?.code,
    isNotLocalZone(store.form.region),
  );

  /**
   * Fetch non-Local network
   */
  const {
    data: networks,
    isLoading: isNetworkLoading,
  } = useAggregatedNonLocalNetworks(projectId, regions);

  useEffect(() => {
    if (gateways?.length > 0 && store.form?.region) {
      const selectedGateway = gateways.find(
        ({ externalInformation }) => externalInformation,
      );

      if (!selectedGateway && gateways.length) {
        store.setForm({ gateway: gateways[0] });
      } else {
        store.setForm({
          gateway: selectedGateway,
        });
      }
    } else {
      store.setForm({
        gateway: undefined,
        gatewayName: undefined,
        gatewaySize: undefined,
      });
    }
  }, [
    gateways?.map((g) => g.id).join(','),
    store.form?.region,
    store.form?.region?.name,
  ]);

  useEffect(() => {
    if (
      productAvailability &&
      productAvailability.length > 0 &&
      store.form.region
    ) {
      const searchedPlan = productAvailability.find(
        ({ code }) => code === GATEWAY_HOURLY_PLAN_CODE,
      );
      const isGatewayAvailable = searchedPlan?.regions?.some(
        ({ name }) => name === store.form.region.code,
      );

      setIsGatewayAvailableInRegion(isGatewayAvailable);
    }
  }, [productAvailability, store.form?.region]);

  useEffect(() => {
    if (networks?.length > 0) {
      const configureVlanId = !isVlanAvailable(networks || [], DEFAULT_VLAN_ID);

      const nextVlanId = configureVlanId
        ? getNextAvailableVlanId(networks || [])
        : store.form.vlanId;
      const address = configureVlanId
        ? regenerateNetworkAddress(nextVlanId)
        : store.form.address;

      store.setForm({
        configureVlanId,
        vlanId: nextVlanId,
        address,
      });
    }
  }, [networks?.map((n) => n.id).join(',')]);

  const onCreateGatewayChange = (checked: boolean) => {
    store.setForm({
      createGateway: checked,
      dhcp: checked || store.form.dhcp,
      enableGatewayIp: checked || store.form.enableGatewayIp,
    });
  };

  const onSetVlanIdChange = (checked: boolean) => {
    store.setForm({
      configureVlanId: checked,
      vlanId: checked
        ? DEFAULT_VLAN_ID
        : getNextAvailableVlanId(networks || []),
    });
  };

  const missingNameError =
    isNetworkNameInputTouched && !store.form.privateNetworkName.length;

  const isIpValid = useMemo(() => isValidIpAddress(store.form.address), [
    store.form.address,
  ]);
  const isMaskValid = useMemo(() => isValidCidrMask(store.form.cidr), [
    store.form.cidr,
  ]);

  const isCreateBtnDisabled = useMemo(
    () =>
      !store.form.privateNetworkName ||
      (!store.form.createGateway && store.project.isDiscovery) ||
      (store.form.dhcp && (!isIpValid || !isMaskValid)),
    [
      store.form.privateNetworkName,
      store.form.createGateway,
      store.form.dhcp,
      store.project.isDiscovery,
      isIpValid,
      isMaskValid,
    ],
  );

  return (
    <StepComponent
      title={t('new:pci_projects_project_network_private_create_configure')}
      edit={{
        action: () => {
          store.updateStep.unCheck(StepsEnum.CONFIGURATION);
          store.updateStep.unlock(StepsEnum.CONFIGURATION);

          store.updateStep.close(StepsEnum.SUMMARY);
        },
        label: t('common_stepper_modify_this_step'),
        isDisabled: false,
      }}
      order={2}
      isOpen={store.steps.get(StepsEnum.CONFIGURATION)?.isOpen}
      isChecked={store.steps.get(StepsEnum.CONFIGURATION)?.isChecked}
      isLocked={store.steps.get(StepsEnum.CONFIGURATION)?.isLocked}
    >
      {!isNetworkLoading ? (
        <div className="my-8">
          <OsdsFormField
            error={missingNameError ? t('common_field_error_required') : ''}
          >
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
              {t('new:pci_projects_project_network_private_create_name')}
            </OsdsText>

            <OsdsInput
              class="md:w-2/5"
              name="privateNetworkName"
              type={ODS_INPUT_TYPE.text}
              defaultValue={DEFAULT_FORM_STATE.privateNetworkName}
              value={store.form.privateNetworkName}
              color={
                missingNameError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              error={missingNameError}
              onOdsInputBlur={() => {
                setIsNetworkNameInputTouched(true);
              }}
              onOdsValueChange={(event) => {
                setIsNetworkNameInputTouched(true);
                store.setForm({ privateNetworkName: `${event.target.value}` });
              }}
            />
          </OsdsFormField>

          {!store.form.region?.isLocalZone && (
            <section className="mt-8">
              <OsdsCheckbox
                name="create-public-gateway"
                checked={store.form.createGateway}
                disabled={!isGatewayAvailableInRegion}
                onOdsCheckedChange={(event: CustomEvent) =>
                  onCreateGatewayChange(event.detail.checked)
                }
              >
                <OsdsCheckboxButton
                  interactive
                  size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_TEXT_SIZE._500}
                    slot="end"
                  >
                    {t(
                      'new:pci_projects_project_network_private_create_public_gateway',
                    )}
                  </OsdsText>
                </OsdsCheckboxButton>
              </OsdsCheckbox>
              <div className="ml-9 mt-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                  className="mb-3 block"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        'new:pci_projects_project_network_private_create_public_gateway_decription_1',
                        {
                          guideLink: PRIVATE_NETWORK_URL,
                        },
                      ),
                    }}
                  />
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                  className="mb-5 block"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        'new:pci_projects_project_network_private_create_public_gateway_decription_2',
                      ),
                    }}
                  />
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        'new:pci_projects_project_network_private_create_public_gateway_footer',
                        { guideLink: REGION_GUIDE_URL },
                      ),
                    }}
                  />
                </OsdsText>
              </div>
            </section>
          )}

          {!store.form.region?.isLocalZone && (
            <section className="mt-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t(
                  'new:pci_projects_project_network_private_create_layer_2_options',
                )}
              </OsdsText>
              <div className="mt-6">
                <OsdsCheckbox
                  checked={store.form.configureVlanId}
                  disabled={!isVlanAvailable(networks || [], DEFAULT_VLAN_ID)}
                  onOdsCheckedChange={(event: CustomEvent) =>
                    onSetVlanIdChange(event.detail.checked)
                  }
                >
                  <OsdsCheckboxButton
                    size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    <span slot="end">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        level={ODS_TEXT_LEVEL.body}
                        size={ODS_TEXT_SIZE._500}
                      >
                        {t(
                          'new:pci_projects_project_network_private_create_configure_choose_vlan',
                        )}
                      </OsdsText>
                    </span>
                  </OsdsCheckboxButton>
                </OsdsCheckbox>
                <div className="ml-4 mt-2">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_TEXT_SIZE._400}
                  >
                    <Trans
                      t={t}
                      i18nKey="pci_projects_project_network_private_create_vlan_tip"
                      components={{
                        link: (
                          <a
                            href={VLAN_GUIDE_URL}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {tCommon('common_find_out_more_here')}
                          </a>
                        ),
                      }}
                    />
                  </OsdsText>
                </div>

                {store.form.configureVlanId && store.form.vlanId === 0 && (
                  <OsdsMessage className="my-4" type={ODS_MESSAGE_TYPE.warning}>
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._400}
                    >
                      {t(
                        'new:pci_projects_project_network_private_create_vlan_id_warning',
                      )}
                    </OsdsText>
                  </OsdsMessage>
                )}

                {store.form.configureVlanId && (
                  <div className="ml-4 my-6">
                    <OsdsFormField>
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        level={ODS_TEXT_LEVEL.body}
                        size={ODS_TEXT_SIZE._200}
                        hue={ODS_TEXT_COLOR_HUE._500}
                        slot="label"
                      >
                        {t(
                          'new:pci_projects_project_network_private_create_configure_vlan',
                        )}
                      </OsdsText>

                      <OsdsQuantity>
                        <OsdsButton
                          slot="minus"
                          variant={ODS_BUTTON_VARIANT.flat}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          size={ODS_BUTTON_SIZE.sm}
                          text-align="center"
                        >
                          <OsdsIcon
                            name={ODS_ICON_NAME.MINUS}
                            size={ODS_ICON_SIZE.sm}
                            className="mr-2 bg-white"
                          />
                        </OsdsButton>
                        <OsdsInput
                          type={ODS_INPUT_TYPE.number}
                          value={store.form.vlanId}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onOdsValueChange={(event) => {
                            store.setForm({
                              vlanId: Number(event.detail.value),
                              address: regenerateNetworkAddress(
                                Number(event.detail.value),
                              ),
                            });
                          }}
                          min={VLAN_ID.MIN}
                          max={VLAN_ID.MAX}
                        />

                        <OsdsButton
                          slot="plus"
                          variant={ODS_BUTTON_VARIANT.flat}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          size={ODS_BUTTON_SIZE.sm}
                          text-align="center"
                        >
                          <OsdsIcon
                            name={ODS_ICON_NAME.PLUS}
                            size={ODS_ICON_SIZE.xs}
                            className="mr-2 bg-white"
                          />
                        </OsdsButton>
                      </OsdsQuantity>

                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        slot="helper"
                      >
                        {t(
                          'new:pci_projects_project_network_private_create_configure_vlan_limits',
                        )}
                      </OsdsText>
                    </OsdsFormField>
                  </div>
                )}

                {store.form.configureVlanId &&
                  !isVlanAvailable(networks || [], store.form.vlanId) && (
                    <OsdsMessage
                      className="mt-4"
                      type={ODS_MESSAGE_TYPE.warning}
                    >
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                      >
                        {t(
                          'new:pci_projects_project_network_private_create_configure_vlan_taken',
                        )}
                      </OsdsText>
                    </OsdsMessage>
                  )}
              </div>
            </section>
          )}

          <section className="mt-6">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.primary}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._500}
              className="mb-6"
            >
              {t(
                'new:pci_projects_project_network_private_create_dhcp_address_distribution_options',
              )}
            </OsdsText>
            <div className="mt-6">
              <OsdsCheckbox
                checked={store.form.dhcp}
                disabled={store.form.createGateway}
                onOdsCheckedChange={(event: CustomEvent) => {
                  store.setForm({ dhcp: event.detail.checked });
                }}
              >
                <OsdsCheckboxButton
                  size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  <span slot="end">
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      level={ODS_TEXT_LEVEL.body}
                      size={ODS_TEXT_SIZE._500}
                    >
                      {t(
                        'new:pci_projects_project_network_private_create_enable_dhcp',
                      )}
                    </OsdsText>
                  </span>
                </OsdsCheckboxButton>
              </OsdsCheckbox>
            </div>

            {store.form.dhcp && (
              <div>
                <div className="mt-4 ml-9 flex flex-column gap-4 items-end">
                  <OsdsFormField>
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
                      {t(
                        'new:pci_projects_project_network_private_create_configure_address',
                      )}
                    </OsdsText>
                    <OsdsInput
                      type={ODS_INPUT_TYPE.text}
                      color={
                        isIpValid
                          ? ODS_THEME_COLOR_INTENT.primary
                          : ODS_THEME_COLOR_INTENT.error
                      }
                      value={store.form.address}
                      onOdsValueChange={({ target }) => {
                        store.setForm({ address: target.value as string });
                      }}
                      inline
                    />
                  </OsdsFormField>
                  <OsdsFormField>
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
                      {t(
                        'new:pci_projects_project_network_private_create_configure_mask',
                      )}
                    </OsdsText>
                    <OsdsInput
                      type={ODS_INPUT_TYPE.number}
                      color={
                        isMaskValid
                          ? ODS_THEME_COLOR_INTENT.primary
                          : ODS_THEME_COLOR_INTENT.error
                      }
                      value={store.form.cidr}
                      onOdsValueChange={({ target }) => {
                        store.setForm({ cidr: +target.value });
                      }}
                      inline
                    />
                  </OsdsFormField>
                  <OsdsPopover>
                    <span slot="popover-trigger">
                      <OsdsIcon
                        name={ODS_ICON_NAME.HELP}
                        size={ODS_ICON_SIZE.xs}
                        className="ml-2"
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                    <OsdsPopoverContent>
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t(
                          'new:pci_projects_project_network_private_create_configure_api',
                        )}
                      </OsdsText>
                    </OsdsPopoverContent>
                  </OsdsPopover>
                </div>

                {(!isIpValid || !isMaskValid) && (
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.error}
                    className="ml-9"
                  >
                    {t('new:pci_projects_network_cidr')}
                  </OsdsText>
                )}

                {store.form.dhcp && (
                  <div className="mt-8 ml-8">
                    <OsdsCheckbox
                      disabled={store.form.createGateway}
                      checked={store.form.enableGatewayIp}
                      onOdsCheckedChange={(event: CustomEvent) => {
                        store.setForm({
                          enableGatewayIp: event.detail.checked,
                        });
                      }}
                    >
                      <OsdsCheckboxButton
                        size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      >
                        <OsdsText
                          color={ODS_THEME_COLOR_INTENT.text}
                          level={ODS_TEXT_LEVEL.body}
                          size={ODS_TEXT_SIZE._500}
                          slot="end"
                        >
                          {t(
                            'new:pci_projects_project_network_private_create_announce_first_address',
                          )}
                        </OsdsText>
                      </OsdsCheckboxButton>
                    </OsdsCheckbox>
                  </div>
                )}
              </div>
            )}
          </section>

          {!store.form.createGateway && isRegionsLoading && (
            <div className="mt-5 gap-5 flex items-center">
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t('new:pci_projects_project_network_private_create_loading')}
              </OsdsText>
            </div>
          )}
          <div className="mt-8">
            {!isNetworkLoading && !store.form.isCreating && (
              <OsdsButton
                data-testid="next-cta"
                size={ODS_BUTTON_SIZE.md}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  clearNotifications();
                  if (store.form.createGateway) {
                    store.updateStep.check(StepsEnum.CONFIGURATION);
                    store.updateStep.lock(StepsEnum.CONFIGURATION);

                    store.updateStep.open(StepsEnum.SUMMARY);
                  } else {
                    onCreate();
                  }
                }}
                className="w-fit"
                disabled={isCreateBtnDisabled || undefined}
              >
                {t(
                  store.form.createGateway
                    ? 'new:pci_projects_project_network_private_create_next'
                    : 'new:pci_projects_project_network_private_create_submit',
                )}
              </OsdsButton>
            )}
            {!store.form.createGateway && store.form.isCreating && (
              <div>
                <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline={true} />
                <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="ml-6">
                  {t('new:pci_projects_project_network_private_create_loading')}
                </OsdsText>
              </div>
            )}
          </div>
        </div>
      ) : (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
      )}
    </StepComponent>
  );
}
