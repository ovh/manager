import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
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
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logStream-spinner"
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between ">
        <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
          {t('log_stream_title_tile_label')}
        </CommonTitle>
        {data?.data.title}
      </div>
    </div>
  );
};

export default SubscriptionStreamTitle;
