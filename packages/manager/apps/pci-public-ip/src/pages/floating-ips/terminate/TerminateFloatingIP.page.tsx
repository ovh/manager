import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { Translation } from 'react-i18next';
import {
  useAllFloatingIP,
  useTerminateFloatingIP,
} from '@/api/hooks/useFloatingIP';
import TerminateModal from '@/components/terminate/Terminate.component';
import { ResponseAPIError } from '@/interface';

export default function TerminateFloatingIPPage() {
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
        <Translation>
          {(t) =>
            t(
              'pci_additional_ips_floating_ips_floating_ip_terminate_success_info',
              {
                ip: floatingIP.ip,
              },
            )
          }
        </Translation>,
      );
      onClose();
    },
    onError: (error) => {
      onClose();
      addError(
        <Translation>
          {(t) =>
            t(
              'pci_additional_ips_floating_ips_floating_ip_terminate_failure_info',
              {
                ip: floatingIP.ip,
                error: (error as ResponseAPIError)?.response?.data?.message,
                interpolation: {
                  escapeValue: false,
                },
              },
            )
          }
        </Translation>,
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
