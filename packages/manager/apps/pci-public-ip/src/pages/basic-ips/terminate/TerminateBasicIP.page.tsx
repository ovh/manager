import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useAllBasicIp, useTerminateBasicIp } from '@/api/hooks/useBasicIp';
import TerminateModal from '@/components/terminate/Terminate.component';
import { ResponseAPIError } from '@/interface';

export default function TerminateBasicIPPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const { projectId, ipId } = useParams();
  const { data: basicIPs, isPending } = useAllBasicIp(projectId);
  const basicIP = basicIPs?.find((row) => row.id === ipId) || undefined;
  const onClose = () => navigate('..');

  const { terminate, isPending: isPendingTerminate } = useTerminateBasicIp({
    projectId,
    onSuccess: () => {
      addSuccess(
        <Translation>
          {(translate) =>
            translate(
              'pci_additional_ips_floating_ips_floating_ip_terminate_success_info',
              {
                ip: basicIP.ip,
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
          {(translate) =>
            translate(
              'pci_additional_ips_floating_ips_floating_ip_terminate_failure_info',
              {
                ip: basicIP.ip,
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
  const onConfirm = () => terminate(basicIP);

  return (
    <TerminateModal
      ip={basicIP?.ip}
      title={t('pci_additional_ips_basic_ip_terminate_title', {
        ip: basicIP?.ip,
      })}
      isPending={isPending}
      isPendingTerminate={isPendingTerminate}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
