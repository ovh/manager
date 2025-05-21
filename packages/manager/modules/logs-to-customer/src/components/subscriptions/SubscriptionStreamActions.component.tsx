import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  getLogStreamUrlQueryKey,
  useLogStreamUrl,
} from '../../data/hooks/useLogStreamUrl';
import { LogSubscription } from '../../data/types/dbaas/logs';
import ApiError from '../apiError/ApiError.component';
import { LogsActionEnum } from '../../types/logsTracking';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';

type SubscriptionStreamItemProps = {
  subscription: LogSubscription;
};

const SubscriptionStreamActions = ({
  subscription,
}: SubscriptionStreamItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('logStream');
  const { t: tSubscription } = useTranslation('logSubscription');
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
        <OdsSpinner size="md" data-testid="logStreamUrl-spinner" />
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
      <Links
        href={data?.streamURL?.address}
        type={LinkType.external}
        target="_blank"
        onClickReturn={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: [graylogObserveLogsAccess],
          });
        }}
        label={t('log_stream_button_graylog_watch_label')}
      />
      <OdsButton
        className="[&::part(button)]:w-full self-stretch"
        variant="outline"
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
        label={tSubscription('log_subscription_button_unsubscribe_label')}
      />
    </div>
  );
};

export default SubscriptionStreamActions;
