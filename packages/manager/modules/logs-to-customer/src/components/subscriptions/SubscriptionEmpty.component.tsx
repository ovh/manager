import { CommonTitle, LinkType, Links } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsTile, OsdsText, OsdsButton } from '@ovhcloud/ods-components/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { LogsContext } from '../../LogsToCustomer.context';

const SubscriptionEmpty = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('logSubscription');
  const { trackingOptions } = useContext(LogsContext);
  const { trackClick } = useOvhTracking();

  return (
    <OsdsTile rounded inline className="flex flex-col">
      <div className="flex flex-col gap-6">
        <CommonTitle>{t('log_subscription_empty_tile_title')}</CommonTitle>
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._200}
        >
          {t('log_subscription_empty_tile_description')}
        </OsdsText>
        <Links
          type={LinkType.external}
          label={t('log_subscription_empty_tile_button_know_more')}
        />
        <OsdsButton
          inline
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: trackingOptions?.trackClickMap.subscribe_logs_access,
            });
            navigate('streams');
          }}
        >
          {t('log_subscription_empty_tile_button_subscribe')}
        </OsdsButton>
      </div>
    </OsdsTile>
  );
};

export default SubscriptionEmpty;
