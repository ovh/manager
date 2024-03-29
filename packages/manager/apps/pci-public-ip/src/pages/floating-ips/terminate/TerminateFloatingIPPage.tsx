import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import {
  useAllFloatingIP,
  useTerminateFloatingIP,
} from '@/api/hooks/useFloatingIP';
import TerminateModal from '@/components/terminate/TerminateModal';
import { ResponseAPIError } from '@/interface';

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
            error: (error as ResponseAPIError)?.response?.data?.message,
          },
        ),
      );
    },
  });
  const onConfirm = () => terminate(floatingIP);

  return (
    <TerminateModal
      ip={floatingIP?.ip}
      isPending={isPending}
      isPendingTerminate={isPendingTerminate}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
