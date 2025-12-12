import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Button, BUTTON_VARIANT, Icon, ICON_NAME, Link, Spinner } from '@ovhcloud/ods-react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  getLogStreamUrlQueryKey,
  useLogStreamUrl,
} from '@/data/hooks/useLogStreamUrl';
import { LogSubscription } from '@/data/types/dbaas/logs';
import ApiError from '@/components/apiError/ApiError.component';
import { LogsActionEnum } from '@/types/logsTracking';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { NAMESPACES } from '@/LogsToCustomer.translations';

type SubscriptionStreamItemProps = {
  subscription: LogSubscription;
};

const SubscriptionStreamActions = ({
  subscription,
}: SubscriptionStreamItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_STREAM);
  const { t: tSubscription } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const { data, isLoading, isPending, error } = useLogStreamUrl(
    subscription.serviceName,
    subscription.streamId,
  );
  const graylogObserveLogsAccess = useLogTrackingActions(
    LogsActionEnum.graylog_observe_logs_access,
  );
  const unsubscribeLogsAccess = useLogTrackingActions(
    LogsActionEnum.unsubscribe_logs_access,
  );
  const { trackClick } = useOvhTracking();

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-4">
        <Spinner size="md" data-testid="logStreamUrl-spinner" />
      </div>
    );
  }

  if (error)
    return (
      <ApiError
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogStreamUrlQueryKey(
              subscription.serviceName,
              subscription.streamId,
            ),
          })
        }
        testId="logStreamUrl-error"
      />
    );

  return (
    <div className="flex flex-col gap-4 items-center">
      <Link
        href={data?.streamURL?.address}
        target="_blank"
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: [graylogObserveLogsAccess],
          });
        }}
      >
        {t('log_stream_button_graylog_watch_label')}
        <Icon name={ICON_NAME.externalLink} />
      </Link>
      <Button
        className="w-full self-stretch"
        variant={BUTTON_VARIANT.outline}
        size="sm"
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: [unsubscribeLogsAccess],
          });
          navigate(`subscription/${subscription.subscriptionId}/terminate`);
        }}
      >
        {tSubscription('log_subscription_button_unsubscribe_label')}
      </Button>
    </div>
  );
};

export default SubscriptionStreamActions;
