import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Divider, Text } from '@ovhcloud/ods-react';
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
    <Card className="flex flex-col w-full h-fit p-4">
      <div className="flex flex-col gap-4">
        <Text preset="heading-4">{t('log_subscription_tile_title')}</Text>
        <SubscriptionLogService
          subscription={subscription}
        ></SubscriptionLogService>
        <SubscriptionStreamTitle
          subscription={subscription}
        ></SubscriptionStreamTitle>
        <Divider spacing="24" className="w-full" />
        <SubscriptionStreamActions
          subscription={subscription}
        ></SubscriptionStreamActions>
      </div>
    </Card>
  );
};

export default SubscriptionTile;
