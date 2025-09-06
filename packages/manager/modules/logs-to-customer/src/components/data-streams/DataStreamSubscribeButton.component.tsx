import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { LogsContext } from '../../LogsToCustomer.context';
import { usePostLogSubscription } from '../../data/hooks/useLogSubscriptions';
import { Stream } from '../../data/types/dbaas/logs';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';

const SubscribeButton = ({ stream }: { stream?: Stream }) => {
  const { t } = useTranslation('logStreams');
  const subscribeLogsAccess = useLogTrackingActions(LogsActionEnum.subscribe_logs_access);
  const { trackClick } = useOvhTracking();
  const { currentLogKind, logApiUrls, logApiVersion, logIamActions, resourceURN } =
    useContext(LogsContext);

  const { mutate, isPending } = usePostLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    currentLogKind,
    stream?.streamId,
  );
  const handleClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [subscribeLogsAccess],
    });
    mutate();
  };

  return (
    <ManagerButton
      size="sm"
      variant="outline"
      onClick={handleClick}
      isLoading={isPending}
      isDisabled={!!stream?.parentStreamId}
      iamActions={logIamActions?.deleteSubscription}
      urn={resourceURN}
      id={'stream-subscription-btn'}
      label={t('log_streams_subscribe')}
    />
  );
};

export default SubscribeButton;
