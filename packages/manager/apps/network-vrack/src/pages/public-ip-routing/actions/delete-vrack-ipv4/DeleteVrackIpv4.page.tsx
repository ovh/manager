import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { useVrackTasksContext } from '@/contexts/vrack-tasks/useVrackTasks';
import { useDeleteVrackIpv4 } from '@/hooks/vrack-ip/ipv4/useDeleteVrackIpv4';
import { getVrackIpv4ListKey } from '@/hooks/vrack-ip/ipv4/useGetVrackIpv4List';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { fromIdToIp } from '@/utils/ipFormatter';

export default function DeleteVrackIpv4() {
  const navigate = useNavigate();
  const { trackTask } = useVrackTasksContext();
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const queryClient = useQueryClient();
  const { addInfo, addSuccess, addError, clearNotifications } = useNotifications();
  const { serviceName = '', ip: urlIp } = useParams<{ serviceName: string; ip: string }>();
  const closeModal = () => {
    navigate('..');
  };

  const ip = fromIdToIp(urlIp) ?? '';

  if (ip === '') {
    closeModal();
  }

  const { mutate: deleteVrackIpv4, isPending: deleteVrackIpv4Pending } = useDeleteVrackIpv4({
    serviceName,
    ip,
    onSuccess: (taskId: number) => {
      clearNotifications();
      addInfo(<Text>{t('publicIpRouting_region_detach_ip_pending')}</Text>);
      trackTask({
        taskId,
        resourceId: ip,
        onFinished: () => {
          clearNotifications();
          addSuccess(<Text>{t('publicIpRouting_region_detach_ip_success')}</Text>);
          void queryClient.invalidateQueries({ queryKey: getVrackIpv4ListKey(serviceName) });
        },
      });
      closeModal();
    },
    onError: (error) => {
      clearNotifications();
      addError(
        <Text>{t('publicIpRouting_region_detach_ip_error', { apiError: error.message })}</Text>,
      );
      closeModal();
    },
  });

  const safeCloseModal = () => {
    if (!deleteVrackIpv4Pending) {
      closeModal();
    }
  };

  return (
    <Modal
      heading={t('publicIpRouting_region_detach_ip_title')}
      onOpenChange={safeCloseModal}
      dismissible={!deleteVrackIpv4Pending}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        loading: deleteVrackIpv4Pending,
        onClick: deleteVrackIpv4,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: safeCloseModal,
      }}
    >
      <Text>{t('publicIpRouting_region_detach_ip_message', { ip })}</Text>
    </Modal>
  );
}
