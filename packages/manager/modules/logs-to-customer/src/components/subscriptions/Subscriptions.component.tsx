import React, { useContext } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useQueryClient } from '@tanstack/react-query';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogsContext } from '../../LogsToCustomer.context';
import {
  getLogSubscriptionsQueryKey,
  useLogSubscriptions,
} from '../../data/hooks/useLogSubscriptions';
import SubscriptionTile from './SubscriptionTile.component';
import SubscriptionEmpty from './SubscriptionEmpty.component';
import ApiError from '../apiError/ApiError.component';

export default function LogsSubscriptions() {
  const { t } = useTranslation('logSubscription');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);
  const { data, isLoading, isPending, error } = useLogSubscriptions(
    logApiUrls.logSubscription,
    logApiVersion,
    currentLogKind,
  );

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

  if (data?.length === 0) return <SubscriptionEmpty />;

  return (
    <div className="flex gap-8 flex-col p-8">
      <CommonTitle>{t('log_subscription_list_title')}</CommonTitle>
      <OsdsButton
        className="flex w-full"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
        onClick={() => navigate('streams')}
      >
        {t('log_subscription_list_button_subscribe_more')}
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.PLUS}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </span>
      </OsdsButton>
      {data.map((subscription) => (
        <SubscriptionTile
          key={subscription.subscriptionId}
          subscription={subscription}
        />
      ))}
    </div>
  );
}
