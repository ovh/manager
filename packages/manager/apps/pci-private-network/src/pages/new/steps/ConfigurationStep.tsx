import { StepComponent } from '@ovhcloud/manager-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TRegion } from '@/api/data/regions';
import { useGatewayByRegion } from '@/api/hooks/useGateway';
import { useAggregatedNonLocalNetworks } from '@/api/hooks/useNetwork';
import { useProductAvailability } from '@/api/hooks/useProductAvailability';
import { getAutoGeneratedName } from '@/api/utils/utils';
import {
  DEFAULT_IP,
  DEFAULT_VLAN_ID,
  GATEWAY_HOURLY_PLAN_CODE,
  GUIDE_LINKS,
  VLAN_ID,
} from '@/constants';
import { DEFAULT_FORM_STATE, TFormState } from '../New.page';
import { TMappedRegion } from './LocalizationStep';
import { TAggregatedNetwork } from '@/api/data/network';

type TConfigurationStepProps = {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
  onNext?: () => void;
  onEdit?: () => void;
  formState: TFormState;
  setFormState: (state) => void;
  regions: TRegion[];
  isLoading: boolean;
};

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
  isOpen,
  isChecked,
  isLocked,
  onNext,
  onEdit,
  formState,
  setFormState,
  regions,
  isLoading,
}: Readonly<TConfigurationStepProps>): JSX.Element {
  const { t } = useTranslation('new');
  const { t: tCommon } = useTranslation('common');

  const [isGatewayAvailableInRegion, setIsGatewayAvailableInRegion] = useState(
    false,
  );
  const [isNetworkNameInputTouched, setIsNetworkNameInputTouched] = useState(
    false,
  );

  const { projectId } = useParams();
  const { ovhSubsidiary } = useEnvironment().getUser();

  const PRIVATE_NETWORK_URL =
    GUIDE_LINKS.PRIVATE_NETWORK_WITH_GATEWAY[ovhSubsidiary] ||
    GUIDE_LINKS.PRIVATE_NETWORK_WITH_GATEWAY.DEFAULT;

  const REGION_GUIDE_URL =
    GUIDE_LINKS.REGION_AVAILABILITY[ovhSubsidiary] ||
    GUIDE_LINKS.REGION_AVAILABILITY.DEFAULT;

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
    formState?.region?.code,
    isNotLocalZone(formState.region),
  );

  /**
   * Fetch non Local network
   */
  const {
    data: networks,
    isLoading: isNetworkLoading,
  } = useAggregatedNonLocalNetworks(projectId, regions);

  useEffect(() => {
    if (gateways?.length > 0 && formState?.region) {
      const selectedGateway = gateways.find(
        ({ externalInformation }) => externalInformation,
      );

      if (!selectedGateway && gateways.length) {
        setFormState((prevState) => ({
          ...prevState,
          gateway: gateways[0],
        }));
      } else {
        const generatedName = getAutoGeneratedName(
          `gateway-${formState?.region?.code.toLowerCase()}`,
        );

        setFormState((prevState) => ({
          ...prevState,
          gateway: selectedGateway,
          gatewayName: generatedName,
        }));
      }
    }
  }, [gateways, formState?.region, formState?.region?.name]);

  useEffect(() => {
    if (
      productAvailability &&
      productAvailability.length > 0 &&
      formState.region
    ) {
      const searchedPlan = productAvailability.find(
        ({ code }) => code === GATEWAY_HOURLY_PLAN_CODE,
      );
      const isGatewayAvailable = searchedPlan?.regions?.some(
        ({ name }) => name === formState.region.code,
      );

      setIsGatewayAvailableInRegion(isGatewayAvailable);
    }
  }, [productAvailability, formState?.region]);

  useEffect(() => {
    if (networks?.length > 0) {
      const configureVlanId = !isVlanAvailable(networks || [], DEFAULT_VLAN_ID);

      const nextVlanId = configureVlanId
        ? getNextAvailableVlanId(networks || [])
        : formState.vlanId;
      const address = configureVlanId
        ? regenerateNetworkAddress(nextVlanId)
        : formState.address;

      setFormState((prevState) => ({
        ...prevState,
        configureVlanId,
        vlanId: nextVlanId,
        address,
      }));
    }
  }, [networks]);

  const onCreateGatewayChange = (checked: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      createGateway: checked,
      dhcp: checked || formState.dhcp,
      enableGatewayIp: checked || formState.enableGatewayIp,
    }));
  };

  const onSetVlanIdChange = (checked) => {
    setFormState((prevState) => ({
      ...prevState,
      configureVlanId: checked,
      vlanId: checked
        ? DEFAULT_VLAN_ID
        : getNextAvailableVlanId(networks || []),
    }));
  };

  return (
    <StepComponent
      title={t('pci_projects_project_network_private_create_configure')}
      next={{
        action: isLoading || isNetworkLoading ? undefined : onNext,
        label: t(
          formState.createGateway
            ? 'pci_projects_project_network_private_create_next'
            : 'pci_projects_project_network_private_create_submit',
        ),
        isDisabled: !formState.privateNetworkName,
      }}
      edit={{
        action: onEdit,
        label: tCommon('common_stepper_modify_this_step'),
      }}
      order={2}
      isOpen={isOpen}
      isChecked={isChecked}
      isLocked={isLocked}
    >
      {!isNetworkLoading ? (
        <div className="my-8">
          <OsdsFormField
            error={
              isNetworkNameInputTouched && !formState.privateNetworkName.length
                ? tCommon('common_field_error_required')
                : ''
            }
          >
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
              {t('pci_projects_project_network_private_create_name')}
            </OsdsText>

            <OsdsInput
              class="md:w-2/5"
              name="privateNetworkName"
              type={ODS_INPUT_TYPE.text}
              color={ODS_THEME_COLOR_INTENT.primary}
              defaultValue={DEFAULT_FORM_STATE.privateNetworkName}
              value={formState.privateNetworkName}
              error={
                isNetworkNameInputTouched &&
                !formState.privateNetworkName.length
              }
              onOdsValueChange={(event) => {
                setIsNetworkNameInputTouched(true);
                setFormState((prevState) => ({
                  ...prevState,
                  privateNetworkName: `${event.target.value}`,
                }));
              }}
            />
          </OsdsFormField>

          {!formState.region?.isLocalZone && (
            <section className="mt-8">
              <OsdsCheckbox
                name="create-public-gateway"
                checked={formState.createGateway}
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
                      'pci_projects_project_network_private_create_public_gateway',
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
                        'pci_projects_project_network_private_create_public_gateway_decription_1',
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
                        'pci_projects_project_network_private_create_public_gateway_decription_2',
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
                        'pci_projects_project_network_private_create_public_gateway_footer',
                        { guideLink: REGION_GUIDE_URL },
                      ),
                    }}
                  />
                </OsdsText>
              </div>
            </section>
          )}

          {!formState.region?.isLocalZone && (
            <section className="mt-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t(
                  'pci_projects_project_network_private_create_layer_2_options',
                )}
              </OsdsText>
              <div className="mt-6">
                <OsdsCheckbox
                  checked={formState.configureVlanId}
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
                          'pci_projects_project_network_private_create_configure_choose_vlan',
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
                    {t('pci_projects_project_network_private_create_vlan_tip')}
                  </OsdsText>
                </div>

                {formState.configureVlanId && formState.vlanId === 0 && (
                  <OsdsMessage className="mb-4" type={ODS_MESSAGE_TYPE.warning}>
                    {t(
                      'pci_projects_project_network_private_create_vlan_id_warning',
                    )}
                  </OsdsMessage>
                )}

                {formState.configureVlanId && (
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
                          'pci_projects_project_network_private_create_configure_vlan',
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
                          value={formState.vlanId}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onOdsValueChange={(event) =>
                            setFormState((prevState) => ({
                              ...prevState,
                              vlanId: Number(event.detail.value),
                              address: regenerateNetworkAddress(
                                Number(event.detail.value),
                              ),
                            }))
                          }
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
                          'pci_projects_project_network_private_create_configure_vlan_limits',
                        )}
                      </OsdsText>
                    </OsdsFormField>
                  </div>
                )}

                {formState.configureVlanId &&
                  !isVlanAvailable(networks || [], formState.vlanId) && (
                    <OsdsMessage
                      className="mt-4"
                      type={ODS_MESSAGE_TYPE.warning}
                    >
                      {t(
                        'pci_projects_project_network_private_create_configure_vlan_taken',
                      )}
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
                'pci_projects_project_network_private_create_dhcp_address_distribution_options',
              )}
            </OsdsText>
            <div className="mt-6">
              <OsdsCheckbox
                checked={formState.dhcp}
                disabled={formState.createGateway}
                onOdsCheckedChange={(event: CustomEvent) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    dhcp: event.detail.checked,
                  }));
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
                        'pci_projects_project_network_private_create_enable_dhcp',
                      )}
                    </OsdsText>
                  </span>
                </OsdsCheckboxButton>
              </OsdsCheckbox>
            </div>

            {formState.dhcp && (
              <div>
                <div className="mt-4 ml-9 flex flex-column gap-4 items-end">
                  <OsdsFormField>
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
                      {t(
                        'pci_projects_project_network_private_create_configure_address',
                      )}
                    </OsdsText>
                    <OsdsInput
                      type={ODS_INPUT_TYPE.text}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      value={formState.address}
                      inline
                      disabled
                    />
                  </OsdsFormField>
                  <OsdsFormField>
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
                      {t(
                        'pci_projects_project_network_private_create_configure_mask',
                      )}
                    </OsdsText>
                    <OsdsInput
                      type={ODS_INPUT_TYPE.number}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      value={formState.cidr}
                      inline
                      disabled
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
                          'pci_projects_project_network_private_create_configure_api',
                        )}
                      </OsdsText>
                    </OsdsPopoverContent>
                  </OsdsPopover>
                </div>

                {formState.dhcp && (
                  <div className="mt-8 ml-8">
                    <OsdsCheckbox
                      disabled={formState.createGateway}
                      checked={formState.enableGatewayIp}
                      onOdsCheckedChange={(event: CustomEvent) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          enableGatewayIp: event.detail.checked,
                        }));
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
                            'pci_projects_project_network_private_create_announce_first_address',
                          )}
                        </OsdsText>
                      </OsdsCheckboxButton>
                    </OsdsCheckbox>
                  </div>
                )}
              </div>
            )}
          </section>

          {!formState.createGateway && isLoading && (
            <div className="mt-5 gap-5 flex items-center">
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t('pci_projects_project_network_private_create_loading')}
              </OsdsText>
            </div>
          )}
        </div>
      ) : (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
      )}
    </StepComponent>
  );
}
