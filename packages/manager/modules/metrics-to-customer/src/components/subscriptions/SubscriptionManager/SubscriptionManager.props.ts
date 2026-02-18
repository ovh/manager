import { ReactNode } from 'react';
import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';

export interface SubscriptionManagerProps<TData = unknown, TSubscription = unknown> {
  children?: ReactNode;
  resourceName?: string;
  data?: TData[];
  isSuccess?: boolean;
  isFiltersReady?: boolean;
  subscriptionUrls?: SubscriptionUrls;
  onCreateSubscription?: (params: { subscribeUrl: string; itemId: string; resourceName: string }) => void;
  onDeleteSubscription?: (params: { subscription: TSubscription; itemId: string; resourceName: string }) => void;
  isCreatingSubscription?: boolean;
  isDeletingSubscription?: boolean;
}
