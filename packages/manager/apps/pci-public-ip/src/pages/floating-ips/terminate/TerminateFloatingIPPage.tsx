import { useNavigate, useParams } from 'react-router-dom';
import {
  OsdsModal,
  OsdsSpinner,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useNotifications } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import {
  useAllFloatingIP,
  useTerminateFloatingIP,
} from '@/api/hooks/useFloatingIP';

export default function TerminateFloatingIPPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { projectId, ipId } = useParams();
  const { data: floatingIPs, isPending } = useAllFloatingIP(projectId);
  const floatingIP = floatingIPs?.find((row) => row.id === ipId) || undefined;
  const onClose = () => navigate('..');

  const { terminate, isPending: isPendingTerminate } = useTerminateFloatingIP({
    projectId,
    onSuccess: () => {
      addSuccess(
        t(
          'pci_additional_ips_floating_ips_floating_ip_terminate_success_info',
          {
            ip: floatingIP.ip,
          },
        ),
      );
      onClose();
    },
    onError: (error) => {
      onClose();
      addError(
        t(
          'pci_additional_ips_floating_ips_floating_ip_terminate_failure_info',
          {
            ip: floatingIP.ip,
            error,
          },
        ),
      );
    },
  });
  const onConfirm = () => terminate(floatingIP);

  return (
    <OsdsModal
      headline={
        !isPending
          ? t('pci_additional_ips_floating_ips_floating_ip_terminate_title', {
              ip: floatingIP?.ip,
            })
          : ''
      }
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {(isPending || isPendingTerminate) && (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
          />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_additional_ips_floating_ips_floating_ip_terminate_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        {...(isPending || isPendingTerminate ? { disabled: true } : {})}
        data-testid="submitButton"
      >
        {t('pci_additional_ips_floating_ips_floating_ip_terminate_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
