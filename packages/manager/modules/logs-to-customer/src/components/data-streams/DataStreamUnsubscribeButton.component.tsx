import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useDeleteLogSubscription } from '../../data/hooks/useLogSubscriptions';
import { LogSubscription } from '../../data/types/dbaas/logs';
import { LogsContext } from '../../LogsToCustomer.context';

const UnsubscribeButton = ({
  subscriptionId,
}: {
  subscriptionId: LogSubscription['subscriptionId'];
}) => {
  const { t } = useTranslation('logStreams');
  const {
    currentLogKind,
    logApiUrls,
    logApiVersion,
    logIamActions,
    resourceURN,
  } = useContext(LogsContext);

  const { mutate, isPending } = useDeleteLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId,
    currentLogKind,
  );

  const handleClick = () => {
    mutate();
  };

  return (
    <ManagerButton
      size="sm"
      variant="outline"
      onClick={handleClick}
      isLoading={isPending}
      iamActions={logIamActions.deleteSubscription}
      urn={resourceURN}
      label={t('log_streams_unsubscribe')}
      id="data-stream-unsubscribe"
    />
  );
};

export default UnsubscribeButton;
