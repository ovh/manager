import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { useVrackTasksContext } from '@/contexts/vrack-tasks/useVrackTasks';
import { useDeleteVrackIpv6Subrange } from '@/hooks/vrack-ip/ipv6/useDeleteVrackIpv6Subrange';
import { getVrackIpv6RoutedSubrangesKey } from '@/hooks/vrack-ip/ipv6/useGetRoutedSubranges';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { fromIdToIp } from '@/utils/ipFormatter';

export default function DeleteVrackIpv6Subrange() {
  const navigate = useNavigate();

  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const queryClient = useQueryClient();
  const { trackTask } = useVrackTasksContext();
  const { addInfo, addSuccess, addError, clearNotifications } = useNotifications();
  const {
    serviceName = '',
    ip: urlIp,
    subrange: urlSubrange,
  } = useParams<{
    serviceName: string;
    ip: string;
    subrange: string;
  }>();
  const closeModal = () => {
    navigate('..');
  };

  const ip = fromIdToIp(urlIp) ?? '';
  const subrange = fromIdToIp(urlSubrange) ?? '';

  if (ip === '') {
    closeModal();
  }

  const { mutate: deleteVrackIpv6Subrange, isPending: deleteVrackIpv6SubrangePending } =
    useDeleteVrackIpv6Subrange({
      serviceName,
      ip,
      subrange,
      onSuccess: (taskId: number) => {
        clearNotifications();
        addInfo(<Text>{t('publicIpRouting_region_detach_subrange_pending')}</Text>);
        trackTask({
          taskId,
          resourceId: subrange,
          onFinished: () => {
            clearNotifications();
            addSuccess(<Text>{t('publicIpRouting_region_detach_subrange_success')}</Text>);
            void queryClient.invalidateQueries({
              queryKey: getVrackIpv6RoutedSubrangesKey(serviceName, ip),
            });
          },
        });
        closeModal();
      },
      onError: (error) => {
        clearNotifications();
        addError(
          <Text>
            {t('publicIpRouting_region_detach_subrange_error', { apiError: error.message })}
          </Text>,
        );
        closeModal();
      },
    });

  const safeCloseModal = () => {
    if (!deleteVrackIpv6SubrangePending) {
      closeModal();
    }
  };

  return (
    <Modal
      heading={t('publicIpRouting_region_detach_subrange_title')}
      onOpenChange={safeCloseModal}
      dismissible={!deleteVrackIpv6SubrangePending}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        loading: deleteVrackIpv6SubrangePending,
        onClick: deleteVrackIpv6Subrange,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: safeCloseModal,
      }}
    >
      <Text>{t('publicIpRouting_region_detach_subrange_message', { ip })}</Text>
    </Modal>
  );
}
