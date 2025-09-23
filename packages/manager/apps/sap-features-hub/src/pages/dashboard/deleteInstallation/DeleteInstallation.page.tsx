import React from 'react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useDeleteInstallation } from '@/data/hooks/useDeleteInstallation';
import { useSapSearchParams } from '@/hooks/sapSearchParams/useSapSearchParams';

export default function DeleteInstallation() {
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const { serviceName, taskId } = useSapSearchParams();

  const {
    mutate: deleteInstallationTask,
    isPending: isDeleting,
  } = useDeleteInstallation({
    serviceName,
    taskId,
    onSettled: () => closeModal(),
    onSuccess: () =>
      addSuccess(t('sap_hub_history_installation_delete_success', { taskId })),
    onError: () =>
      addError(t('sap_hub_history_installation_delete_error', { taskId })),
  });

  return (
    <Modal
      isOpen
      heading={t('sap_hub_history_installation_delete')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      onPrimaryButtonClick={deleteInstallationTask}
      isPrimaryButtonLoading={isDeleting}
      isPrimaryButtonDisabled={isDeleting}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsText>{t('sap_hub_history_installation_delete_content')}</OdsText>
    </Modal>
  );
}
