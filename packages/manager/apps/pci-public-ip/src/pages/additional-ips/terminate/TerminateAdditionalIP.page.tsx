import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { ResponseAPIError } from '@ovh-ux/manager-pci-common';
import {
  useAllFailoverIPs,
  useTerminateFailoverIP,
} from '@/api/hooks/useFailoverIP';
import TerminateModal from '@/components/terminate/Terminate.component';

export default function TerminateAdditionalIPPage() {
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { projectId, ipId } = useParams();
  const { data: failoverIPs, isPending } = useAllFailoverIPs(projectId);
  const failoverIP = failoverIPs?.find((row) => row.id === ipId) || undefined;
  const onClose = () => navigate('..');

  const { terminate, isPending: isPendingTerminate } = useTerminateFailoverIP({
    projectId,
    onSuccess: () => {
      addSuccess(
        <Translation>
          {(t) =>
            t(
              'pci_additional_ips_floating_ips_floating_ip_terminate_success_info',
              {
                ip: failoverIP.ip,
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
                ip: failoverIP.ip,
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
  const onConfirm = () => terminate(failoverIP);

  return (
    <TerminateModal
      ip={failoverIP?.ip}
      isPending={isPending}
      isPendingTerminate={isPendingTerminate}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
