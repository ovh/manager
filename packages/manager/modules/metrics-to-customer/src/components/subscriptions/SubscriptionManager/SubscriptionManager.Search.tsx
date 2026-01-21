import React from 'react';
import { Input, INPUT_TYPE } from '@ovhcloud/ods-react';
import { useSubscriptionManagerContext } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.context';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@/MetricsToCustomer.translations';

export function SubscriptionManagerSearch() {

  const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);

  const { searchQuery, setSearchQuery } = useSubscriptionManagerContext();

  return (
    <Input
      type={INPUT_TYPE.search}
      placeholder={t('search.placeholder')}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

export const Search = SubscriptionManagerSearch;
