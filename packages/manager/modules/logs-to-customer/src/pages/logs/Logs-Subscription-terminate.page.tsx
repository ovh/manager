import React, { useContext } from 'react';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTerminateLogSubscription } from '../../data/hooks/useTerminateLogSubscription';
import { LogsContext } from '../../LogsToCustomer.context';

export default function DataStreamsTerminate() {
  const navigate = useNavigate();
  const { t } = useTranslation('logSubscription');
  const { subscriptionId } = useParams();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  const { terminateLogSubscription } = useTerminateLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId,
    currentLogKind,
  );
  return (
    <DeleteModal
      headline={t('log_subscription_terminate_modal_headline')}
      deleteInputLabel={t(
        'log_subscription_terminate_modal_delete_input_label',
      )}
      confirmButtonLabel={t(
        'log_subscription_terminate_modal_confirm_button_label',
      )}
      closeModal={() => {
        navigate('..');
      }}
      onConfirmDelete={() => {
        terminateLogSubscription();
        navigate('..');
      }}
    ></DeleteModal>
  );
}
