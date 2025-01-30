import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useDeleteLogSubscription } from '../../data/hooks/useLogSubscriptions';
import { LogSubscription } from '../../data/types/dbaas/logs';
import { LogsContext } from '../../LogsToCustomer.context';

const UnsubscribeButton = ({
  subscriptionId,
}: {
  subscriptionId: LogSubscription['subscriptionId'];
}) => {
  const { t } = useTranslation('logStreams');
  const {
    currentLogKind,
    logApiUrls,
    logApiVersion,
    logIamActions,
    resourceURN,
  } = useContext(LogsContext);

  const { mutate, isPending } = useDeleteLogSubscription(
    logApiUrls.logSubscription,
    logApiVersion,
    subscriptionId,
    currentLogKind,
  );

  const handleClick = () => {
    mutate();
  };

  return (
    <ManagerButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.stroked}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={handleClick}
      disabled={isPending || null}
      iamActions={logIamActions.deleteSubscription}
      urn={resourceURN}
    >
      {isPending ? (
        <OsdsIcon
          name={ODS_ICON_NAME.REFRESH}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.sm}
        />
      ) : (
        t('log_streams_unsubscribe')
      )}
    </ManagerButton>
  );
};

export default UnsubscribeButton;
