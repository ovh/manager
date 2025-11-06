import React, { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DeleteModal } from '@ovh-ux/muk';

import { LogsContext } from '@/LogsToCustomer.context';
import { useDeleteLogSubscription } from '@/data/hooks/useLogSubscriptions';
import { NAMESPACES } from '@/LogsToCustomer.translations';

export default function DataStreamsTerminate() {
  const navigate = useNavigate();
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
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
      open
      isLoading={isPending}
      onClose={() => {
        navigate('..');
      }}
      onConfirmDelete={() => {
        mutate();
      }}
    />
  );
}
