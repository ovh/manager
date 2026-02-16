import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button, Spinner, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import ApiError from '@/components/api-error/ApiError.component';
import OrderServiceButton from '@/components/services/OrderServiceButton.component';
import { getLogServicesQueryKey, useLogServices } from '@/data/hooks/useLogService';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';

const SubscriptionAddSubcription = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const { t: tService } = useTranslation(NAMESPACES.LOG_SERVICE);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const subscribeLogsAccess = useLogTrackingActions(LogsActionEnum.subscribe_logs_access);

  const { data: logServices, isPending, error } = useLogServices();

  if (isPending) return <Spinner size="sm" data-testid="logServices-spinner" />;

  if (error)
    return (
      <ApiError
        testId="logServices-error"
        error={error}
        onRetry={() => {
          void queryClient.refetchQueries({
            queryKey: getLogServicesQueryKey(),
          });
        }}
      />
    );

  if (logServices.length === 0)
    return (
      <div className="flex flex-col gap-2">
        <Text preset="paragraph">{tService('log_service_no_service_description')}</Text>
        <OrderServiceButton />
      </div>
    );

  return (
    <Button
      variant={BUTTON_VARIANT.outline}
      className="w-full"
      size="sm"
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [subscribeLogsAccess],
        });
        navigate('streams');
      }}
    >
      {t('log_subscription_empty_tile_button_subscribe')}
    </Button>
  );
};

export default SubscriptionAddSubcription;
