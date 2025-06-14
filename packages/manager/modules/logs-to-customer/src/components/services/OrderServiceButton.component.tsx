import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';

const OrderServiceButton = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('logService');

  const goToOrderLogs = useLogTrackingActions(LogsActionEnum.go_to_order_logs);

  const { data: dedicatedUrl } = useNavigationGetUrl(['dedicated', '', {}]);

  return (
    <OdsButton
      className="[&::part(button)]:w-full"
      size="sm"
      variant="outline"
      label={t('log_service_create')}
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [goToOrderLogs],
        });
        window.open(`${dedicatedUrl}/dbaas/logs/order`, '_self');
      }}
    />
  );
};

export default OrderServiceButton;
