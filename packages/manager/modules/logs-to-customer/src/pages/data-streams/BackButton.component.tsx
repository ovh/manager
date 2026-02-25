import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button, Icon } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';

export default function BackButton() {
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const subscribeLogsAccessAction = useLogTrackingActions(LogsActionEnum.subscribe_logs_access);

  return (
    <Button
      size="sm"
      variant={BUTTON_VARIANT.ghost}
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [subscribeLogsAccessAction],
        });
        navigate('..');
      }}
    >
      <Icon name="arrow-left" className="mr-2" />
      {t('log_streams_back_button')}
    </Button>
  );
}
