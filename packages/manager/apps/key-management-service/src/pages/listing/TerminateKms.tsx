import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TerminateModal } from '@/components/Modal/terminate/TerminateModal.component';
import { useTerminateOKms } from '@/api/hooks/useTerminateOKms';

export default function TerminateKms() {
  const { t } = useTranslation('key-management-service/terminate');
  const navigate = useNavigate();
  const { kmsId } = useParams();

  const closeModal = () => {
    navigate('..');
  };

  const { terminateKms, isErrorVisible, error } = useTerminateOKms({
    kmsId,
    onSuccess: closeModal,
  });

  return (
    <TerminateModal
      headline={t('key_management_service_terminate_heading')}
      terminateInputButton={t('key_management_service_terminate_confirm')}
      description={t('key_management_service_terminate_description')}
      onConfirmTerminate={terminateKms}
      closeModal={closeModal}
      error={isErrorVisible ? error : null}
    />
  );
}
