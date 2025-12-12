import React, { useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Spinner, Text } from '@ovhcloud/ods-react';
import { LogsContext } from '@/LogsToCustomer.context';
import {
  getLogSubscriptionsQueryKey,
  useLogSubscriptions,
} from '@/data/hooks/useLogSubscriptions';
import SubscriptionTile from '@/components/subscriptions/SubscriptionTile.component';
import SubscriptionEmpty from '@/components/subscriptions/SubscriptionEmpty.component';
import ApiError from '@/components/apiError/ApiError.component';
import { useZoomedInOut } from '@/hooks/useZoomedInOut';
import { NAMESPACES } from '@/LogsToCustomer.translations';

export default function LogsSubscriptions() {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const queryClient = useQueryClient();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);
  const { data, isLoading, isPending, error } = useLogSubscriptions(
    logApiUrls.logSubscription,
    logApiVersion,
    currentLogKind,
  );
  const { isZoomedIn } = useZoomedInOut();

  if (!currentLogKind) {
    return (
      <div className="flex py-8">
        <Spinner size="md" data-testid="logCurrentLogKind-spinner" />
      </div>
    );
  }

  if (isLoading || isPending)
    return (
      <div className="flex py-8">
        <Spinner size="md" data-testid="logSubscriptions-spinner" />
      </div>
    );

  if (error)
    return (
      <ApiError
        testId="logSubscriptions-error"
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogSubscriptionsQueryKey(
              logApiUrls.logSubscription,
              currentLogKind,
            ),
          })
        }
      />
    );

  return (
    <div className="flex flex-col gap-4">
      <Text preset="heading-3">{t('log_subscription_list_title')}</Text>
      <div
        className={
          isZoomedIn
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'flex flex-col gap-4'
        }
      >
        <SubscriptionEmpty />
        {data.map((subscription) => (
          <SubscriptionTile
            key={subscription.subscriptionId}
            subscription={subscription}
          />
        ))}
      </div>
    </div>
  );
}
