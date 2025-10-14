import { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsSpinner } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useKubernetesCluster, useResetKubeConfig } from '@/api/hooks/useKubernetes';
import ResetKubeConfigContent from '@/components/reset-kubeconfig/ResetKubeConfigContent';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

export default function ResetKubeConfigPage() {
  const { t: tResetKubeConfig } = useTranslation('reset-kubeconfig');
  const { projectId, kubeId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const { data: kubernetesCluster, isPending: isPendingCluster } = useKubernetesCluster(
    projectId,
    kubeId,
  );
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { tracking } = useContext(ShellContext)?.shell || {};

  const { resetKubeConfig, isPending: isPendingResetKubeConfig } = useResetKubeConfig({
    projectId,
    kubeId,
    onError(error: ApiError) {
      addError(
        <Translation ns="reset-kubeconfig">
          {(_t) =>
            _t('pci_projects_project_kubernetes_service_reset_kubeconfig_error', {
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
        <Translation ns="reset-kubeconfig">
          {(_t) => _t('pci_projects_project_kubernetes_service_reset_kubeconfig_success')}
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const isPending = isPendingCluster || isPendingResetKubeConfig;

  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::reset-kubeconfig::cancel`,
        });
        onClose();
      }}
      headline={tResetKubeConfig('pci_projects_project_kubernetes_service_reset_kubeconfig')}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="resetKubeConfig-spinner"
          />
        ) : (
          <ResetKubeConfigContent isClusterReady={kubernetesCluster?.isClusterReady} />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::reset-kubeconfig::cancel`,
          });
          onClose();
        }}
        data-testid="resetKubeConfig-button_cancel"
      >
        {tResetKubeConfig('pci_projects_project_kubernetes_service_reset_kubeconfig_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || undefined}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::reset-kubeconfig::confirm`,
          });
          resetKubeConfig();
        }}
        data-testid="resetKubeConfig-button_submit"
      >
        {tResetKubeConfig(
          'pci_projects_project_kubernetes_service_reset_kubeconfig_common_confirm',
        )}
      </OsdsButton>
    </OsdsModal>
  );
}
