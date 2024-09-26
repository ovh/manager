import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsMessage,
  OsdsModal,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsRadioGroupValueChangeEventDetail,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useContext, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useKubernetesCluster,
  useResetCluster,
} from '@/api/hooks/useKubernetes';
import { WORKER_NODE_POLICIES } from '@/constants';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import { getFormatedKubeVersion } from '@/helpers';
import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';
import { TNetwork } from '@/api/data/network';
import { SubnetSelector } from '@/components/network/SubnetSelector.component';
import {
  GatewaySelector,
  GatewaySelectorState,
} from '@/components/network/GatewaySelector.component';
import { ModeEnum } from '@/components/network/GatewayModeSelector.component';
import { LoadBalancerWarning } from '@/components/network/LoadBalancerWarning.component';
import { SelectComponent } from '@/components/input/Select.component';

export default function ResetClusterPage() {
  const { t: tReset } = useTranslation('reset');
  const { t: tListing } = useTranslation('listing');
  const { t } = useTranslation('network-add');

  const { addError, addSuccess } = useNotifications();
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const { tracking } = useContext(ShellContext)?.shell || {};
  const [isExpanded, setIsExpanded] = useState(false);

  const onClose = () => navigate('..');

  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);

  const {
    data: cloudSchema,
    isPending: isPendingCloudSchema,
  } = useGetCloudSchema();

  const kubeVersions = cloudSchema.models['cloud.kube.VersionEnum'].enum;

  const {
    data: privateNetworks,
    isPending: isPendingPrivateNetworks,
  } = useAvailablePrivateNetworks(projectId, kubernetesCluster?.region);

  const defaultNetwork = {
    id: 'none',
    name: t('kubernetes_network_form_none'),
  } as TNetwork;

  const getPrivateNetworkById = (id: string): TNetwork =>
    privateNetworks?.find(
      (privateNetwork) => privateNetwork.clusterRegion.openstackId === id,
    );

  const [formState, setFormState] = useState({
    workerNodesPolicy: WORKER_NODE_POLICIES.DELETE,
    selectedVersion: getFormatedKubeVersion(kubernetesCluster?.version || ''),
    privateNetworkId: kubernetesCluster?.privateNetworkId,
    subnet: null,
    loadBalancersSubnet: null,
    gateway: {
      isEnabled:
        kubernetesCluster?.privateNetworkConfiguration
          ?.privateNetworkRoutingAsDefault ||
        !!kubernetesCluster?.privateNetworkConfiguration?.defaultVrackGateway,
      ip:
        kubernetesCluster?.privateNetworkConfiguration?.defaultVrackGateway ||
        '',
    } as GatewaySelectorState,
  });

  const shouldWarnSubnet = formState.subnet && !formState.subnet?.gatewayIp;

  const shouldWarnLoadBalancerSubnet =
    formState.subnet?.gatewayIp &&
    formState.loadBalancersSubnet &&
    !formState.loadBalancersSubnet?.gatewayIp;

  const { resetCluster, isPending: isPendingResetCluster } = useResetCluster({
    onError(error: ApiError) {
      addError(
        <Translation ns="reset">
          {(_t) =>
            _t('pci_projects_project_kubernetes_service_reset_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="reset">
          {(_t) => _t('pci_projects_project_kubernetes_service_reset_success')}
        </Translation>,
        true,
      );
      onClose();
    },
    projectId,
    kubeId,
    params: {
      loadBalancersSubnetId: formState.loadBalancersSubnet?.id,
      nodesSubnetId: formState.subnet?.id,
      privateNetworkConfiguration: {
        privateNetworkRoutingAsDefault: formState.gateway?.isEnabled,
        defaultVrackGateway: formState.gateway?.ip || '',
      },
      privateNetworkId: formState.privateNetworkId,
      version: formState.selectedVersion,
      workerNodesPolicy: formState.workerNodesPolicy,
    },
  });

  const isPending =
    isPendingCluster ||
    isPendingCloudSchema ||
    isPendingPrivateNetworks ||
    isPendingResetCluster;

  return (
    <OsdsModal
      headline={tReset('pci_projects_project_kubernetes_service_reset')}
      color={ODS_TEXT_COLOR_INTENT.warning}
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::reset::cancel`,
        });
        onClose();
      }}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="resetCluster-spinner"
          />
        ) : (
          <div className="mt-6">
            <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
              <span
                dangerouslySetInnerHTML={{
                  __html: tReset(
                    'pci_projects_project_kubernetes_service_reset_message',
                  ),
                }}
              />
            </OsdsMessage>

            <OsdsFormField className="mt-6">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                slot="label"
                size={ODS_TEXT_SIZE._200}
              >
                {tReset('pci_projects_project_kubernetes_service_reset_nodes')}
              </OsdsText>
              <OsdsRadioGroup
                value={formState.workerNodesPolicy}
                onOdsValueChange={(
                  event: OsdsRadioGroupCustomEvent<
                    OdsRadioGroupValueChangeEventDetail
                  >,
                ) => {
                  setFormState({
                    ...formState,
                    workerNodesPolicy: event.detail.newValue,
                  });
                }}
              >
                <OsdsRadio value={WORKER_NODE_POLICIES.DELETE}>
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.xs}
                  >
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      slot="end"
                      className={
                        formState.workerNodesPolicy ===
                        WORKER_NODE_POLICIES.DELETE
                          ? 'font-bold'
                          : 'font-normal'
                      }
                      size={ODS_TEXT_SIZE._600}
                    >
                      {tReset(
                        'pci_projects_project_kubernetes_service_reset_common_delete',
                      )}
                    </OsdsText>
                  </OsdsRadioButton>
                </OsdsRadio>
                <OsdsRadio
                  value={WORKER_NODE_POLICIES.REINSTALL}
                  className="mt-2"
                >
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.xs}
                  >
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      slot="end"
                      size={ODS_TEXT_SIZE._600}
                      className={
                        formState.workerNodesPolicy ===
                        WORKER_NODE_POLICIES.REINSTALL
                          ? 'font-bold'
                          : 'font-normal'
                      }
                    >
                      {tReset(
                        'pci_projects_project_kubernetes_service_reset_common_reinstall',
                      )}
                    </OsdsText>
                  </OsdsRadioButton>
                </OsdsRadio>
              </OsdsRadioGroup>
            </OsdsFormField>

            <OsdsFormField className="mt-6">
              <OsdsText
                slot="label"
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {tReset(
                  'pci_projects_project_kubernetes_service_reset_version',
                )}
              </OsdsText>
              <OsdsSelect
                value={formState.selectedVersion}
                onOdsValueChange={(event) => {
                  setFormState({
                    ...formState,
                    selectedVersion: event.detail.value.toString(),
                  });
                }}
              >
                {kubeVersions.map((kubeVersion) => (
                  <OsdsSelectOption value={kubeVersion} key={kubeVersion}>
                    {kubeVersion}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
            </OsdsFormField>

            {/* PrivateNetwork */}
            <OsdsFormField className="mt-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                slot="label"
              >
                {tListing('kubernetes_add_private_network_label')}
              </OsdsText>
              <SelectComponent
                value={formState.privateNetworkId || defaultNetwork?.id}
                onOdsValueChange={(event) => {
                  const value = `${event.detail.value}`;
                  setFormState({
                    ...formState,
                    privateNetworkId: value === 'none' ? undefined : value,
                    subnet: null,
                    loadBalancersSubnet: null,
                  });
                }}
              >
                <OsdsSelectOption value={defaultNetwork.id}>
                  {defaultNetwork.name}
                </OsdsSelectOption>
                {privateNetworks?.map((network) => (
                  <OsdsSelectOption
                    key={network.id}
                    value={network?.clusterRegion?.openstackId}
                  >
                    {network.name}
                  </OsdsSelectOption>
                ))}
              </SelectComponent>
            </OsdsFormField>

            {formState.privateNetworkId && (
              <div>
                <SubnetSelector
                  className="mt-6"
                  title={t('kubernetes_network_form_subnet')}
                  projectId={projectId}
                  networkId={formState.privateNetworkId}
                  region={
                    getPrivateNetworkById(formState.privateNetworkId)
                      ?.clusterRegion?.region
                  }
                  onSelect={(subnet) =>
                    setFormState((network) => ({
                      ...network,
                      subnet,
                    }))
                  }
                  showSpinner
                />

                {shouldWarnSubnet && <LoadBalancerWarning />}
              </div>
            )}

            {formState.privateNetworkId && formState.subnet && (
              <>
                <GatewaySelector
                  initialValue={formState.gateway}
                  className="mt-8"
                  onSelect={(gateway) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      gateway,
                    }))
                  }
                />

                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.heading}
                  size={ODS_TEXT_SIZE._400}
                  className="block my-8 flex items-center"
                  onClick={() => setIsExpanded((e) => !e)}
                >
                  {t('kubernetes_network_form_load_balancers_subnet_toggler')}
                  <OsdsIcon
                    name={
                      isExpanded
                        ? ODS_ICON_NAME.CHEVRON_UP
                        : ODS_ICON_NAME.CHEVRON_DOWN
                    }
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.sm}
                    aria-hidden="true"
                    className="ml-4"
                  />
                </OsdsText>

                <div className={isExpanded ? 'block' : 'hidden'}>
                  <SubnetSelector
                    className="mt-6"
                    title={t('kubernetes_network_form_load_balancers_subnet')}
                    projectId={projectId}
                    networkId={formState.privateNetworkId}
                    region={
                      getPrivateNetworkById(formState.privateNetworkId)
                        ?.clusterRegion?.region
                    }
                    onSelect={(loadBalancersSubnet) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        loadBalancersSubnet,
                      }))
                    }
                    allowsEmpty
                    preselectedId={kubernetesCluster?.loadBalancersSubnetId}
                  />

                  {shouldWarnLoadBalancerSubnet && <LoadBalancerWarning />}
                </div>
              </>
            )}
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::reset::cancel`,
          });
          onClose();
        }}
        data-testid="reset-button_cancel"
      >
        {tReset('pci_projects_project_kubernetes_service_reset_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={
          isPending ||
          (formState.gateway.mode === ModeEnum.CUSTOM &&
            formState.gateway.ip === '') ||
          undefined
        }
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::reset::confirm`,
          });
          resetCluster();
        }}
        data-testid="reset-button_submit"
      >
        {tReset('pci_projects_project_kubernetes_service_reset_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
