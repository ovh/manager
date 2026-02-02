import React, { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { Modal } from '@ovh-ux/manager-react-components';

import { LogsContext } from '@/LogsToCustomer.context';
import { NAMESPACES } from '@/LogsToCustomer.translations';
import { useDeleteLogSubscription } from '@/data/hooks/useLogSubscriptions';

export default function DataStreamsTerminate() {
  const navigate = useNavigate();
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const { subscriptionId } = useParams();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  const closeModal = () => {
    navigate('..');
  };

  const { mutate, isPending } = useDeleteLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId ?? '',
    currentLogKind,
    closeModal,
  );

  return (
    <Modal
      isOpen
      heading={t('log_subscription_terminate_modal_headline')}
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t('log_subscription_terminate_modal_confirm_button')}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      onPrimaryButtonClick={mutate}
      secondaryLabel={t('log_subscription_terminate_modal_cancel_button')}
      onSecondaryButtonClick={closeModal}
    >
      <OdsText>{t('log_subscription_terminate_modal_description')}</OdsText>
    </Modal>
  );
}
