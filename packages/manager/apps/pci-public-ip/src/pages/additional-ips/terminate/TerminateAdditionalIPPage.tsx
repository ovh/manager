import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { Translation } from 'react-i18next';
import {
  useAllFailoverIPs,
  useTerminateFailoverIP,
} from '@/api/hooks/useFailoverIP';
import TerminateModal from '@/components/terminate/TerminateModal';
import { ResponseAPIError } from '@/api/hooks/useProject';

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
