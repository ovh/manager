import {
  OsdsButton,
  OsdsFormField,
  OsdsLink,
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
import { useNotifications, useProjectUrl } from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
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
import { useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useKubernetesCluster,
  useResetCluster,
} from '@/api/hooks/useKubernetes';
import { GATEWAY_IP_REGEX, WORKER_NODE_POLICIES } from '@/constants';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import { getFormatedKubeVersion } from '@/helpers';
import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
import GatewayManagement from '@/components/GatewayManagement.component';

export default function ResetClusterPage() {
  const { t: tReset } = useTranslation('reset');
  const { t: tListing } = useTranslation('listing');
  const { addError, addSuccess } = useNotifications();
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const urlProject = useProjectUrl('public-cloud');
  const [gatewayError, setGatewayError] = useState(false);
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

  const [formState, setFormState] = useState({
    workerNodesPolicy: WORKER_NODE_POLICIES.DELETE,
    selectedVersion: getFormatedKubeVersion(kubernetesCluster?.version || ''),
    privateNetworkId: kubernetesCluster?.privateNetworkId,
    gateway: {
      enabled: !!kubernetesCluster?.privateNetworkConfiguration
        ?.defaultVrackGateway,
      ip:
        kubernetesCluster?.privateNetworkConfiguration?.defaultVrackGateway ||
        '',
    },
  });
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
      ...(formState.gateway.enabled && {
        privateNetworkConfiguration: {
          defaultVrackGateway: formState.gateway.ip,
          privateNetworkRoutingAsDefault: true,
        },
      }),
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
      onOdsModalClose={onClose}
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
            <OsdsFormField className="mt-10">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                slot="label"
              >
                {tListing('kubernetes_add_private_network_label')}
              </OsdsText>
              <OsdsSelect
                value={formState.privateNetworkId}
                onOdsValueChange={(event) => {
                  setFormState({
                    ...formState,
                    privateNetworkId: event.detail.value.toString(),
                  });
                }}
              >
                {privateNetworks?.map((network) => (
                  <OsdsSelectOption
                    key={network.id}
                    value={network.clusterRegion.openstackId}
                  >
                    {network.name}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
              <OsdsText
                className="mt-3"
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
              >
                {tListing('kubernetes_add_private_network_description')}
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={`${urlProject}/private-networks`}
                >
                  {tListing('kubernetes_add_private_network_add')}
                </OsdsLink>
              </OsdsText>
            </OsdsFormField>
            <GatewayManagement
              className="mt-10"
              clusterGateway={formState.gateway}
              gatewayError={gatewayError}
              onUpdated={(gateway) => {
                setFormState({
                  ...formState,
                  gateway,
                });
                setGatewayError(
                  gateway.ip &&
                    RegExp(GATEWAY_IP_REGEX).test(gateway.ip) === false,
                );
              }}
            />
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="reset-button_cancel"
      >
        {tReset('pci_projects_project_kubernetes_service_reset_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || gatewayError || undefined}
        onClick={resetCluster}
        data-testid="reset-button_submit"
      >
        {tReset('pci_projects_project_kubernetes_service_reset_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
