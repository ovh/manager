import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  useKubernetesCluster,
  useResetKubeConfig,
} from '@/api/hooks/useKubernetes';
import ResetKubeConfigContent from '@/components/reset-kubeconfig/ResetKubeConfigContent';

export default function ResetKubeConfigPage() {
  const { t: tResetKubeConfig } = useTranslation('reset-kubeconfig');
  const { projectId, kubeId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const {
    resetKubeConfig,
    isPending: isPendingResetKubeConfig,
  } = useResetKubeConfig({
    projectId,
    kubeId,
    onError(error: ApiError) {
      addError(
        <Translation ns="reset-kubeconfig">
          {(_t) =>
            _t(
              'pci_projects_project_kubernetes_service_reset_kubeconfig_error',
              {
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="reset-kubeconfig">
          {(_t) =>
            _t(
              'pci_projects_project_kubernetes_service_reset_kubeconfig_success',
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });
  const isPending = isPendingCluster || isPendingResetKubeConfig;
  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={tResetKubeConfig(
        'pci_projects_project_kubernetes_service_reset_kubeconfig',
      )}
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
          <ResetKubeConfigContent
            isClusterReady={kubernetesCluster?.isClusterReady}
          />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => onClose()}
        data-testid="resetKubeConfig-button_cancel"
      >
        {tResetKubeConfig(
          'pci_projects_project_kubernetes_service_reset_kubeconfig_common_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || undefined}
        onClick={resetKubeConfig}
        data-testid="resetKubeConfig-button_submit"
      >
        {tResetKubeConfig(
          'pci_projects_project_kubernetes_service_reset_kubeconfig_common_confirm',
        )}
      </OsdsButton>
    </OsdsModal>
  );
}