import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getLogStreamQueryKey,
  useLogStream,
} from '../../data/hooks/useLogStream';
import { LogSubscription } from '../../data/types/dbaas/logs';
import ApiError from '../apiError/ApiError.component';

type SubscriptionStreamItemProps = {
  subscription: LogSubscription;
};

const SubscriptionStreamTitle = ({
  subscription,
}: SubscriptionStreamItemProps) => {
  const { t } = useTranslation('logStream');
  const queryClient = useQueryClient();
  const { data, isLoading, isPending, error } = useLogStream(
    subscription.serviceName,
    subscription.streamId,
  );

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-4">
        <OdsSpinner size="sm" data-testid="logStream-spinner" />
      </div>
    );
  }

  if (error)
    return (
      <ApiError
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogStreamQueryKey(
              subscription.serviceName,
              subscription.streamId,
            ),
          })
        }
        testId="logStream-error"
      />
    );
  return (
    <div className="flex flex-row justify-between ">
      <OdsText preset="heading-6">{t('log_stream_title_tile_label')}</OdsText>
      <OdsText preset="paragraph">{data?.data.title}</OdsText>
    </div>
  );
};

export default SubscriptionStreamTitle;
