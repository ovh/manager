import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { MODAL_COLOR, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { useDeleteVrackIpv4 } from '@/hooks/vrack-ip/useDeleteVrackIpv4';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { fromIdToIp } from '@/utils/ipFormatter';

export default function DeleteVrackIpv4() {
  const navigate = useNavigate();

  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const { addError, clearNotifications } = useNotifications();
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
    onSuccess: closeModal,
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
      type={MODAL_COLOR.warning}
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
