import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import KnowMoreLink from '@/components/services/KnowMoreLink.component';
import SubscriptionAddSubcription from '@/components/subscriptions/SubscriptionsAddSubscription';

const SubscriptionEmpty = () => {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);

  return (
    <Card className="flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <Text preset="heading-4">{t('log_subscription_empty_tile_title')}</Text>
        <Text preset="paragraph">{t('log_subscription_empty_tile_description')}</Text>
        <KnowMoreLink />
        <SubscriptionAddSubcription />
      </div>
    </Card>
  );
};

export default SubscriptionEmpty;
