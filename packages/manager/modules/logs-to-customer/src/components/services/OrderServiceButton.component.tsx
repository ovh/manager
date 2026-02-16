import React from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';

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
        window.open(`${String(dedicatedUrl)}/dbaas/logs/order`, '_self');
      }}
    >
      {t('log_service_create')}
    </Button>
  );
};

export default OrderServiceButton;
