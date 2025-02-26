import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getLogServiceQueryKey,
  useLogService,
} from '../../data/hooks/useLogService';
import { LogSubscription } from '../../data/types/dbaas/logs';
import ApiError from '../apiError/ApiError.component';

type SubscriptionLogServiceProps = {
  subscription: LogSubscription;
};

const SubscriptionLogService = ({
  subscription,
}: SubscriptionLogServiceProps) => {
  const { t } = useTranslation('logService');
  const queryClient = useQueryClient();
  const { data, isLoading, isPending, error } = useLogService(
    subscription.serviceName,
  );

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-6">
        <OdsSpinner size="sm" data-testid="logService-spinner" />
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-between ">
          <OdsText preset="heading-6">
            {data?.data.displayName || subscription.serviceName}
          </OdsText>
          <OdsText preset="span">{subscription.serviceName}</OdsText>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-between ">
          <OdsText preset="heading-6">
            {t('log_service_username_tile_label')}
          </OdsText>
          <OdsText preset="span">{data?.data.username}</OdsText>
        </div>
      </div>
    </>
  );
};

export default SubscriptionLogService;
