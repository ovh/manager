import {
  DeleteServiceModal,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { AxiosError } from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const TerminateLicensePage = () => {
  const { t } = useTranslation('hycu/terminate');
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const closeModal = () => {
    navigate('..');
  };

  const handleSuccessDelete = async () => {
    closeModal();
    addSuccess(t('hycu_terminate_success_message', { serviceName }), true);
  };

  const handleErrorDelete = async (error: AxiosError) => {
    closeModal();
    addError(t('hycu_terminate_error_message', { error: error.message }));
  };

  return (
    <DeleteServiceModal
      headline={t('hycu_terminate_headline')}
      description={t('hycu_terminate_description')}
      deleteInputLabel=""
      cancelButtonLabel={t('hycu_terminate_cancel_label')}
      confirmButtonLabel={t('hycu_terminate_confirm_label')}
      onSuccess={handleSuccessDelete}
      onError={handleErrorDelete}
      closeModal={closeModal}
      resourceName={serviceName}
      onConfirmDelete={() => {}}
    />
  );
};

export default TerminateLicensePage;
