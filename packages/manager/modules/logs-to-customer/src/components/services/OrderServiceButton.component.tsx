import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';
import { NAMESPACES } from '@/LogsToCustomer.translations';

const OrderServiceButton = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(NAMESPACES.LOG_SERVICE);

  const goToOrderLogs = useLogTrackingActions(LogsActionEnum.go_to_order_logs);

  const { data: dedicatedUrl } = useNavigationGetUrl(['dedicated', '', {}]);

  return (
    <Button
      className="w-full"
      size="sm"
      variant={BUTTON_VARIANT.outline}
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [goToOrderLogs],
        });
        window.open(`${dedicatedUrl}/dbaas/logs/order`, '_self');
      }}
    >
      {t('log_service_create')}
    </Button>
  );
};

export default OrderServiceButton;
