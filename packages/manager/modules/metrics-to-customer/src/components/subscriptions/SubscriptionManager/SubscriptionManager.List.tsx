import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { useSubscriptionManagerContext } from '@/contexts/SubscriptionManager.context';

import SubscriptionCard from '@/components/subscriptions/SubscriptionManager/SubscriptionCard.component';
import { SubscriptionManagerListProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.List.props';
import { SubscriptionManagerSearch } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Search';

export function SubscriptionManagerList<TData = unknown, TSubscription = unknown>({
  titleFn,
  subtitleFn,
  idFn,
  subscriptionFn,
  withSearch = false,
}: SubscriptionManagerListProps<TData, TSubscription>) {
  const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);
  const context = useSubscriptionManagerContext<TData, TSubscription>();

  const {
    resourceName,
    subscriptionUrls,
    onCreateSubscription,
    onDeleteSubscription,
    isCreatingSubscription,
    isDeletingSubscription,
    setTitleSubtitleFns,
    filteredData,
    hasFilteredData,
    shouldShowData,
    searchQuery,
  } = context;

  useEffect(() => {
    if (setTitleSubtitleFns) {
      setTitleSubtitleFns(titleFn, subtitleFn);
    }
  }, [titleFn, subtitleFn, setTitleSubtitleFns]);

  if (!shouldShowData) return null;

  const listContent = hasFilteredData ? (
    <div className="flex flex-col gap-4">
      {filteredData.map((item, index) => {
        const itemKey = `${idFn(item)}_${index}`;
        const itemId = idFn(item);
        const itemTitle = titleFn(item);
        const itemSubtitle = subtitleFn(item);
        const itemSubscription = subscriptionFn
          ? subscriptionFn(item, resourceName)
          : undefined;

        return (
          <SubscriptionCard
            key={itemKey}
            itemId={itemId}
            resourceName={resourceName}
            title={itemTitle}
            subTitle={itemSubtitle}
            subscription={itemSubscription}
            subscriptionUrls={subscriptionUrls}
            onCreate={onCreateSubscription}
            onDelete={onDeleteSubscription}
            isCreating={isCreatingSubscription}
            isDeleting={isDeletingSubscription}
          />
        );
      })}
    </div>
  ) :  searchQuery.trim() ? (
    <div className="text-center text-gray-500 py-4">
      {t('tenants_drawer.no_results_found', { searchQuery })}
    </div>
  ) : null;

  if (withSearch) {
    return (
      <div className="flex flex-col gap-4">
        <SubscriptionManagerSearch />
        {listContent}
      </div>
    );
  }

  return listContent;
}

export const List = SubscriptionManagerList;
