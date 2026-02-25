import { SubscriptionUrls } from "@/types/SubscriptionUrls.type";

export type SubscriptionToggleProps<TSubscription = unknown> = {  
  itemId: string;
  resourceName: string;
  subscriptionUrls: SubscriptionUrls;
  subscription?: TSubscription;
  onCreate: (params: { subscribeUrl: string; itemId: string; resourceName: string }) => void;
  onDelete: (params: { subscription: TSubscription; itemId: string; resourceName: string }) => void;
  isCreating?: boolean;
  isDeleting?: boolean;
};
