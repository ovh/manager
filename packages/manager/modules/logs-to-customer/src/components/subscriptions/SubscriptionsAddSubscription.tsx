import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsButton, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';
import {
  getLogServicesQueryKey,
  useLogServices,
} from '../../data/hooks/useLogService';
import ApiError from '../apiError/ApiError.component';
import OrderServiceButton from '../services/OrderServiceButton.component';

const SubscriptionAddSubcription = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('logSubscription');
  const { t: tService } = useTranslation('logService');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const subscribeLogsAccess = useLogTrackingActions(
    LogsActionEnum.subscribe_logs_access,
  );

  const { data: logServices, isPending, error } = useLogServices();

  if (isPending)
    return <OdsSpinner size="sm" data-testid="logServices-spinner" />;

  if (error)
    return (
      <ApiError
        testId="logServices-error"
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogServicesQueryKey(),
          })
        }
      />
    );

  if (logServices.length === 0)
    return (
      <div className="flex flex-col gap-2">
        <OdsText preset="paragraph">
          {tService('log_service_no_service_description')}
        </OdsText>
        <OrderServiceButton />
      </div>
    );

  return (
    <OdsButton
      variant="outline"
      className="[&::part(button)]:w-full"
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
      label={t('log_subscription_empty_tile_button_subscribe')}
    />
  );
};

export default SubscriptionAddSubcription;
