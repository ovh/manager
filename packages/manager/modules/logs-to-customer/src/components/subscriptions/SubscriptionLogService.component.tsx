import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
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
      <div className="flex justify-center w-full py-4">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logService-spinner"
        />
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between ">
          <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
            {data?.data.displayName || subscription.serviceName}
          </CommonTitle>
          {subscription.serviceName}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between ">
          <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
            {t('log_service_username_tile_label')}
          </CommonTitle>
          {data?.data.username}
        </div>
      </div>
    </>
  );
};

export default SubscriptionLogService;
