import React from 'react';
import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { LogSubscription } from '@/data/types/dbaas/logs';
import SubscriptionStreamTitle from '@/components/subscriptions/SubscriptionStreamTitle.component';
import SubscriptionStreamActions from '@/components/subscriptions/SubscriptionStreamActions.component';
import SubscriptionLogService from '@/components/subscriptions/SubscriptionLogService.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

type SubscriptionTileProps = {
  subscription: LogSubscription;
};

const SubscriptionTile = ({ subscription }: SubscriptionTileProps) => {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);

  return (
    <OdsCard className="flex flex-col w-full h-fit p-4">
      <div className="flex flex-col gap-4">
        <OdsText preset="heading-4">{t('log_subscription_tile_title')}</OdsText>
        <SubscriptionLogService
          subscription={subscription}
        ></SubscriptionLogService>
        <SubscriptionStreamTitle
          subscription={subscription}
        ></SubscriptionStreamTitle>
        <OdsDivider />
        <SubscriptionStreamActions
          subscription={subscription}
        ></SubscriptionStreamActions>
      </div>
    </OdsCard>
  );
};

export default SubscriptionTile;
