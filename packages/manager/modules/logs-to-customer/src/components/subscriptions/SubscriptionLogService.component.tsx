import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { Spinner, Text } from '@ovhcloud/ods-react';
import {
  getLogServiceQueryKey,
  useLogService,
} from '@/data/hooks/useLogService';
import { LogSubscription } from '@/data/types/dbaas/logs';
import ApiError from '@/components/apiError/ApiError.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

type SubscriptionLogServiceProps = {
  subscription: LogSubscription;
};

const SubscriptionLogService = ({
  subscription,
}: SubscriptionLogServiceProps) => {
  const { t } = useTranslation(NAMESPACES.LOG_SERVICE);
  const queryClient = useQueryClient();
  const { data: service, isLoading, isPending, error } = useLogService(
    subscription.serviceName,
  );

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-4">
        <Spinner size="sm" data-testid="logService-spinner" />
      </div>
    );
  }

  if (error)
    return (
      <ApiError
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogServiceQueryKey(subscription.serviceName),
          })
        }
        testId="logService-error"
      />
    );

  return (
    <>
      <div className="flex flex-row justify-between ">
        <Text preset="heading-6">
          {service?.displayName || subscription.serviceName}
        </Text>
        <Text preset="span">{subscription.serviceName}</Text>
      </div>
      <div className="flex flex-row justify-between ">
        <Text preset="heading-6">
          {t('log_service_username_tile_label')}
        </Text>
        <Text preset="span">{service?.username}</Text>
      </div>
    </>
  );
};

export default SubscriptionLogService;
