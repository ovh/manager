import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { OdsText, OdsButton, OdsCard } from '@ovhcloud/ods-components/react';
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
    <OdsCard className="flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <OdsText preset="heading-4">
          {t('log_subscription_empty_tile_title')}
        </OdsText>
        <OdsText preset="paragraph">
          {t('log_subscription_empty_tile_description')}
        </OdsText>
        <Links
          type={LinkType.external}
          label={t('log_subscription_empty_tile_button_know_more')}
        />
        <OdsButton
          variant="outline"
          className="[&::part(button)]:w-full"
          size="sm"
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: trackingOptions?.trackClickMap.subscribe_logs_access,
            });
            navigate('streams');
          }}
          label={t('log_subscription_empty_tile_button_subscribe')}
        />
      </div>
    </OdsCard>
  );
};

export default SubscriptionEmpty;
