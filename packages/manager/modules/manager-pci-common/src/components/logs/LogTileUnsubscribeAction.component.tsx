import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OsdsButton, OsdsSpinner } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useRemoveSubscription } from '../../api/hook/useLogs';
import { LogContext } from './LogProvider.component';

import '../../translations/logs';

export interface LogTileUnsubscribeActionProps {
  subscriptionId: string;
  onSuccess: () => void;
  onError: (err: ApiError) => void;
}

export function LogTileUnsubscribeAction({
  subscriptionId,
  onSuccess,
  onError,
}: Readonly<LogTileUnsubscribeActionProps>) {
  const { t } = useTranslation('pci-logs');
  const { logsApiURL } = useContext(LogContext);
  const { remove, isPending: isRemovePending } = useRemoveSubscription({
    logsApiURL,
    subscriptionId,
    onSuccess,
    onError,
  });
  return (
    <>
      {isRemovePending && (
        <div className="text-center mt-8">
          <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
        </div>
      )}
      {!isRemovePending && (
        <OsdsButton
          className="mt-4"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={remove}
        >
          {t('list_button_unsubscribe')}
        </OsdsButton>
      )}
    </>
  );
}
