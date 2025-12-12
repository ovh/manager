import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { Spinner, Text } from '@ovhcloud/ods-react';
import {
  getLogStreamQueryKey,
  useLogStream,
} from '@/data/hooks/useLogStream';
import { LogSubscription } from '@/data/types/dbaas/logs';
import ApiError from '@/components/apiError/ApiError.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

type SubscriptionStreamItemProps = {
  subscription: LogSubscription;
};

const SubscriptionStreamTitle = ({
  subscription,
}: SubscriptionStreamItemProps) => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAM);
  const queryClient = useQueryClient();
  const { data: stream, isLoading, isPending, error } = useLogStream(
    subscription.serviceName,
    subscription.streamId,
  );

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-4">
        <Spinner size="sm" data-testid="logStream-spinner" />
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
      <Text preset="heading-6">{t('log_stream_title_tile_label')}</Text>
      <Text preset="paragraph">{stream?.title}</Text>
    </div>
  );
};

export default SubscriptionStreamTitle;
