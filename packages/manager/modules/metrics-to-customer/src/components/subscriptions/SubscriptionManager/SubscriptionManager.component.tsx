import { SubscriptionManagerProvider } from '@/contexts/SubscriptionManager.context';

import { SubscriptionManagerProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.props';
import { Filters } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Filters';
import { Search } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Search';
import { List } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.List';
import { Footer } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Footer';

function SubscriptionManager<TData = unknown, TSubscription = unknown>({
  children,
  resourceName,
  data,
  isSuccess,
  isFiltersReady,
  subscriptionUrls,
  onCreateSubscription,
  onDeleteSubscription,
  isCreatingSubscription,
  isDeletingSubscription,
}: SubscriptionManagerProps<TData, TSubscription>) {
  return (
    <SubscriptionManagerProvider<TData, TSubscription>
      resourceName={resourceName}
      data={data}
      isSuccess={isSuccess}
      isFiltersReady={isFiltersReady}
      subscriptionUrls={subscriptionUrls}
      onCreateSubscription={onCreateSubscription}
      onDeleteSubscription={onDeleteSubscription}
      isCreatingSubscription={isCreatingSubscription}
      isDeletingSubscription={isDeletingSubscription}
    >
      <div className="w-full flex flex-col gap-6 mb-6">
        {children}
      </div>
    </SubscriptionManagerProvider>
  );
}

SubscriptionManager.Filters = Filters;
SubscriptionManager.Search = Search;
SubscriptionManager.List = List;
SubscriptionManager.Footer = Footer;

export default SubscriptionManager;
