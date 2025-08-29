import React, { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DeleteModal } from '@ovh-ux/manager-react-components';

import { LogsContext } from '../../LogsToCustomer.context';
import { useDeleteLogSubscription } from '../../data/hooks/useLogSubscriptions';

export default function DataStreamsTerminate() {
  const navigate = useNavigate();
  const { t } = useTranslation('logSubscription');
  const { subscriptionId } = useParams();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  const { mutate, isPending } = useDeleteLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId ?? '',
    currentLogKind,
    () => {
      navigate('..');
    },
  );
  return (
    <DeleteModal
      isOpen
      headline={t('log_subscription_terminate_modal_headline')}
      deleteInputLabel={t('log_subscription_terminate_modal_delete_input_label')}
      confirmButtonLabel={t('log_subscription_terminate_modal_confirm_button_label')}
      closeModal={() => {
        navigate('..');
      }}
      onConfirmDelete={() => {
        mutate();
      }}
      isLoading={isPending}
    ></DeleteModal>
  );
}
