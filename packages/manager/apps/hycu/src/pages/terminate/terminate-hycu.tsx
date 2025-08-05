import React, { useContext } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useNotifications,
  DeleteModal,
} from '@ovh-ux/manager-react-components';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { US_SUBSIDIARY } from '@/constants';

export const TerminateLicensePage = () => {
  const { t } = useTranslation([
    'hycu/terminate',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const closeModal = () => {
    navigate('..');
  };

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess: () => {
      closeModal();
      addSuccess(
        t(
          ovhSubsidiary === US_SUBSIDIARY
            ? 'hycu_terminate_success_message_us'
            : 'hycu_terminate_success_message',
          { serviceName },
        ),
        true,
      );
    },
    onError: () => {
      closeModal();
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message || 'Unknown error',
        }),
      );
    },
  });

  const onConfirmDelete = () => {
    terminateService({ resourceName: serviceName });
  };

  return (
    <DeleteModal
      closeModal={closeModal}
      error={isError ? error?.message : null}
      onConfirmDelete={onConfirmDelete}
      isLoading={isPending}
    />
  );
};

export default TerminateLicensePage;
