import { SubscriptionUrls } from "@/types/SubscriptionUrls.type";

export type SubscriptionToggleBase = {
  itemId: string;
  resourceName: string;
};

export type SubscriptionToggleCreate = SubscriptionToggleBase & {
  subscribeUrl: string;
};

export type SubscriptionToggleDelete<TSubscription> =SubscriptionToggleBase & {
  subscription: TSubscription;
};

export type SubscriptionToggleProps<TSubscription = unknown> = {
  itemId: string;
  resourceName: string;
  subscriptionUrls: SubscriptionUrls;
  subscription?: TSubscription;
  isLoading?: boolean;
  onCreate: (params: SubscriptionToggleCreate) => void;
  onDelete: (params: SubscriptionToggleDelete<TSubscription>) => void;
};