import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { usePostLogSubscription } from '../../data/hooks/useLogSubscriptions';
import { Stream } from '../../data/types/dbaas/logs';
import { LogsContext } from '../../LogsToCustomer.context';

const SubscribeButton = ({ stream }: { stream: Stream }) => {
  const { t } = useTranslation('logStreams');

  const {
    currentLogKind,
    logApiUrls,
    logApiVersion,
    logIamActions,
    resourceURN,
  } = useContext(LogsContext);

  const { mutate, isPending } = usePostLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    currentLogKind,
    stream.streamId,
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
      isDisabled={!!stream.parentStreamId}
      iamActions={logIamActions.deleteSubscription}
      urn={resourceURN}
      id={'stream-subscription-btn'}
      label={t('log_streams_subscribe')}
    />
  );
};

export default SubscribeButton;
