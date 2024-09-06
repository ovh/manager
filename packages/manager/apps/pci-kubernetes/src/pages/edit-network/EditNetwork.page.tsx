import { useState } from 'react';
import {
  OsdsAccordion,
  OsdsButton,
  OsdsMessage,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
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

  const onSubmit = async () => {
    setIsSubmitting(true);
    editNetwork(
      projectId,
      kubeId,
      hasGatewayChanges && {
        privateNetworkRoutingAsDefault: gatewayForm.isEnabled,
        defaultVrackGateway:
          gatewayForm.mode === ModeEnum.CUSTOM ? gatewayForm.ip : '',
      },
      hasLoadBalancersChanges && loadBalancerSubnet?.id,
    )
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: getRegionSubsnetsQueryKey(
            projectId,
            kubeDetail.region,
            kubeDetail.privateNetworkId,
          ),
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
            <OsdsAccordion
              className="block mt-8"
              opened={!!kubeDetail?.loadBalancersSubnetId || undefined}
            >
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="summary"
              >
                {tAdd('kubernetes_network_form_load_balancers_subnet_toggler')}
              </OsdsText>
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
            </OsdsAccordion>
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
