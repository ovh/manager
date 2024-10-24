import { useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMessage,
  OsdsModal,
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
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { PrivateNetworkSelector } from '@/components/network/PrivateNetworkSelector.component';
import { SubnetSelector } from '@/components/network/SubnetSelector.component';
import {
  GatewaySelector,
  GatewaySelectorState,
} from '@/components/network/GatewaySelector.component';
import { useKubeNetwork } from '@/components/network/useKubeNetwork';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { editNetwork } from '@/api/data/kubernetes';
import queryClient from '@/queryClient';
import { getRegionSubsnetsQueryKey } from '@/api/hooks/useSubnets';
import { ModeEnum } from '@/components/network/GatewayModeSelector.component';
import { LoadBalancerWarning } from '@/components/network/LoadBalancerWarning.component';
import {
  getAllKubeQueryKey,
  getKubernetesClusterQuery,
} from '@/api/hooks/useKubernetes';

export default function EditNetworkPage() {
  const { t } = useTranslation('edit-network');
  const { t: tAdd } = useTranslation('network-add');
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gatewayForm, setGatewayForm] = useState<GatewaySelectorState>({
    isEnabled: false,
    mode: ModeEnum.AUTO,
    ip: '',
  });
  const [loadBalancerSubnet, setLoadBalancerSubnet] = useState<
    TPrivateNetworkSubnet
  >(undefined);

  const [isExpanded, setIsExpanded] = useState(true);

  const { isPending, kubeDetail, kubeSubnet } = useKubeNetwork({
    projectId,
    kubeId,
  });

  const isPrivateRouting =
    kubeDetail?.privateNetworkConfiguration.privateNetworkRoutingAsDefault;
  const gatewayIp = kubeDetail?.privateNetworkConfiguration.defaultVrackGateway;

  const hasGatewayChanges =
    isPrivateRouting !== gatewayForm.isEnabled ||
    (gatewayForm.isEnabled && gatewayForm.ip !== gatewayIp);

  const isIpValid =
    gatewayForm.mode === ModeEnum.CUSTOM ? !!gatewayForm.ip : true;

  const hasLoadBalancersChanges =
    kubeDetail?.loadBalancersSubnetId !== loadBalancerSubnet?.id;

  const hasChanges = hasGatewayChanges || hasLoadBalancersChanges;

  const shouldWarnLoadBalancerSubnet =
    loadBalancerSubnet && !loadBalancerSubnet.gatewayIp;

  const onSubmit = async () => {
    setIsSubmitting(true);
    editNetwork(
      projectId,
      kubeId,
      hasLoadBalancersChanges,
      loadBalancerSubnet?.id || null,
      hasGatewayChanges && {
        privateNetworkRoutingAsDefault: gatewayForm.isEnabled,
        defaultVrackGateway:
          gatewayForm.mode === ModeEnum.CUSTOM ? gatewayForm.ip : '',
      },
    )
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: getRegionSubsnetsQueryKey(
            projectId,
            kubeDetail.region,
            kubeDetail.privateNetworkId,
          ),
        });
        await queryClient.invalidateQueries({
          queryKey: getKubernetesClusterQuery(projectId, kubeId),
        });
        await queryClient.invalidateQueries({
          queryKey: getAllKubeQueryKey(projectId),
        });
        onClose();
        addSuccess(
          <Translation ns="edit-network">
            {(_t) => _t('pci_kubernetes_edit_network_success')}
          </Translation>,
        );
      })
      .catch((err) => {
        onClose();
        addError(
          <Translation ns="edit-network">
            {(_t) =>
              _t('pci_kubernetes_edit_network_error', {
                message: err?.response?.data?.message || err?.message || null,
              })
            }
          </Translation>,
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <OsdsModal
      onOdsModalClose={() => {
        onClose();
      }}
      headline={t('pci_kubernetes_edit_network_title')}
    >
      <slot name="content">
        {isPending || isSubmitting ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="updateOIDCProvider-spinner"
          />
        ) : (
          <>
            <PrivateNetworkSelector
              className="mt-6"
              projectId={projectId}
              kubeId={kubeId}
              disabled
            />
            <SubnetSelector
              className="mt-6"
              key={kubeDetail?.privateNetworkId}
              title={tAdd('kubernetes_network_form_label')}
              projectId={projectId}
              networkId={kubeDetail?.privateNetworkId}
              region={kubeDetail?.region}
              preselectedId={kubeSubnet?.id}
              allowsEmpty
              disabled
            />
            <GatewaySelector
              className="mt-6"
              initialValue={{
                isEnabled:
                  kubeDetail?.privateNetworkConfiguration
                    .privateNetworkRoutingAsDefault,
                ip: kubeDetail?.privateNetworkConfiguration.defaultVrackGateway,
              }}
              onSelect={setGatewayForm}
            />
            {hasGatewayChanges && (
              <OsdsMessage
                className="mt-4"
                type={ODS_MESSAGE_TYPE.warning}
                color={ODS_THEME_COLOR_INTENT.warning}
              >
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tAdd('kubernetes_network_form_rebuild')}
                </OsdsText>
              </OsdsMessage>
            )}

            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              className="block my-8 flex items-center"
              onClick={() => setIsExpanded((e) => !e)}
            >
              {tAdd('kubernetes_network_form_load_balancers_subnet_toggler')}
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
                title={tAdd('kubernetes_network_form_load_balancers_subnet')}
                projectId={projectId}
                networkId={kubeDetail?.privateNetworkId}
                region={kubeDetail?.region}
                preselectedId={kubeDetail.loadBalancersSubnetId}
                onSelect={setLoadBalancerSubnet}
                allowsEmpty
              />

              {shouldWarnLoadBalancerSubnet && <LoadBalancerWarning />}
            </div>
          </>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="edit-network-button_cancel"
      >
        {t('pci_kubernetes_edit_network_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={
          isPending || isSubmitting || !hasChanges || !isIpValid || undefined
        }
        onClick={onSubmit}
        data-testid="edit-network-button_submit"
      >
        {t('pci_kubernetes_edit_network_submit')}
      </OsdsButton>
    </OsdsModal>
  );
}
