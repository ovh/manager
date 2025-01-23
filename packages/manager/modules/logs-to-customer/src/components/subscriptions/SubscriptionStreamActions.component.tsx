import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getLogStreamUrlQueryKey,
  useLogStreamUrl,
} from '../../data/hooks/useLogStreamUrl';
import { LogSubscription } from '../../data/types/dbaas/logs';
import ApiError from '../apiError/ApiError.component';

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

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center w-full py-4">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logStreamUrl-spinner"
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
    <>
      <OsdsButton
        href={data?.streamURL?.address}
        disabled={!data?.streamURL || undefined}
        className="flex w-full"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('log_stream_button_graylog_watch_label')}
        <span slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </span>
      </OsdsButton>
      <OsdsButton
        className="flex w-full"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          navigate(`subscription/${subscription.subscriptionId}/terminate`);
        }}
      >
        {tSubscription('log_subscription_button_unsubscribe_label')}
      </OsdsButton>
    </>
  );
};

export default SubscriptionStreamActions;
