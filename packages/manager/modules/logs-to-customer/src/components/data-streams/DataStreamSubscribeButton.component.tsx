import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { LogsContext } from '@/LogsToCustomer.context';
import { NAMESPACES } from '@/LogsToCustomer.translations';
import { usePostLogSubscription } from '@/data/hooks/useLogSubscriptions';
import { Stream } from '@/data/types/dbaas/logs/Logs.type';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';

const SubscribeButton = ({ stream }: { stream?: Stream }) => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
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
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      loading={isPending}
      disabled={!!stream?.parentStreamId}
      iamActions={logIamActions?.deleteSubscription}
      urn={resourceURN}
      id="stream-subscription-btn"
    >
      {t('log_streams_subscribe')}
    </Button>
  );
};

export default SubscribeButton;
