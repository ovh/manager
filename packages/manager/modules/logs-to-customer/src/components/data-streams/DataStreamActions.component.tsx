import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { Skeleton } from '@ovhcloud/ods-react';

import { LogsContext } from '@/LogsToCustomer.context';
import { useLogSubscriptions } from '@/data/hooks/useLogSubscriptions';
import { Stream } from '@/data/types/dbaas/logs';
import getStreamSubscription from '@/helpers/getStreamSubscription';
import SubscribeButton from '@/components/data-streams/DataStreamSubscribeButton.component';
import UnsubscribeButton from '@/components/data-streams/DataStreamUnsubscribeButton.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

export const DATA_STREAM_SUBSCRIPTION_LOADING_TEST_ID = 'data-stream-subscription-loading-test-id';

interface TDataStreamActions {
  stream?: Stream;
}

const DataStreamActions = ({ stream }: TDataStreamActions) => {
  const { t } = useTranslation(NAMESPACES.ERROR);
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  const {
    data: subscriptions,
    isPending,
    error,
  } = useLogSubscriptions(logApiUrls.logSubscription, logApiVersion, currentLogKind);

  if (isPending) return <Skeleton data-testid={DATA_STREAM_SUBSCRIPTION_LOADING_TEST_ID} />;

  if (error) return <span>{t('error_datagrid_cell')}</span>;

  const dataStreamSubscription = getStreamSubscription(subscriptions, stream?.streamId);

  return dataStreamSubscription ? (
    <UnsubscribeButton subscriptionId={dataStreamSubscription.subscriptionId} />
  ) : (
    <SubscribeButton stream={stream} />
  );
};

export default DataStreamActions;
