import React from 'react';
import { DeleteModal } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { terminateValue } from './TerminateModal.constants';

export type TerminateModalProps = {
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmTerminate: () => void;
};

export const TerminateModal: React.FC<TerminateModalProps> = ({
  closeModal,
  isLoading,
  onConfirmTerminate,
}) => {
  const { t } = useTranslation('key-management-service/terminate');
  return (
    <DeleteModal
      headline={t('key_management_service_terminate_heading')}
      description={t('key_management_service_terminate_description', {
        terminateKeyword: terminateValue,
      })}
      deleteInputLabel=""
      closeModal={closeModal}
      onConfirmDelete={onConfirmTerminate}
    />
  );
};
