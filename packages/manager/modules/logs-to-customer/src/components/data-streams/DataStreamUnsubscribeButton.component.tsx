import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { LogsContext } from '../../LogsToCustomer.context';
import { useDeleteLogSubscription } from '../../data/hooks/useLogSubscriptions';
import { LogSubscription } from '../../data/types/dbaas/logs';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';

const UnsubscribeButton = ({
  subscriptionId,
}: {
  subscriptionId: LogSubscription['subscriptionId'];
}) => {
  const { t } = useTranslation('logStreams');
  const unsubscribeLogsAccess = useLogTrackingActions(LogsActionEnum.unsubscribe_logs_access);
  const { trackClick } = useOvhTracking();
  const { currentLogKind, logApiUrls, logApiVersion, logIamActions, resourceURN } =
    useContext(LogsContext);

  const { mutate, isPending } = useDeleteLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId,
    currentLogKind,
  );

  const handleClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [unsubscribeLogsAccess],
    });
    mutate();
  };

  return (
    <ManagerButton
      size="sm"
      variant="outline"
      onClick={handleClick}
      isLoading={isPending}
      iamActions={logIamActions?.deleteSubscription}
      urn={resourceURN}
      label={t('log_streams_unsubscribe')}
      id="data-stream-unsubscribe"
    />
  );
};

export default UnsubscribeButton;
