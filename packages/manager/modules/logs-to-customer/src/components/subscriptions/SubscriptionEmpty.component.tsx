import { OdsText, OdsCard } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SubscriptionAddSubcription from '@/components/subscriptions/SubscriptionsAddSubscription';
import KnowMoreLink from '@/components/services/KnowMoreLink.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

const SubscriptionEmpty = () => {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);

  return (
    <OdsCard className="flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <OdsText preset="heading-4">
          {t('log_subscription_empty_tile_title')}
        </OdsText>
        <OdsText preset="paragraph">
          {t('log_subscription_empty_tile_description')}
        </OdsText>
        <KnowMoreLink />
        <SubscriptionAddSubcription />
      </div>
    </OdsCard>
  );
};

export default SubscriptionEmpty;
