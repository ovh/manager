import React, { useContext } from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useQueryClient } from '@tanstack/react-query';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { LogsContext } from '../../LogsToCustomer.context';
import {
  getLogSubscriptionsQueryKey,
  useLogSubscriptions,
} from '../../data/hooks/useLogSubscriptions';
import SubscriptionTile from './SubscriptionTile.component';
import SubscriptionEmpty from './SubscriptionEmpty.component';
import ApiError from '../apiError/ApiError.component';
import { useZoomedInOut } from '../../hooks/useZoomedInOut';

export default function LogsSubscriptions() {
  const { t } = useTranslation('logSubscription');
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
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logCurrentLogKind-spinner"
        />
      </div>
    );
  }

  if (isLoading || isPending)
    return (
      <div className="flex py-8">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logSubscriptions-spinner"
        />
      </div>
    );

  if (error)
    return (
      <ApiError
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogSubscriptionsQueryKey(
              logApiUrls.logSubscription,
              currentLogKind,
            ),
          })
        }
        testId="logSubscriptions-error"
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <CommonTitle>{t('log_subscription_list_title')}</CommonTitle>
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
