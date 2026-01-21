export interface SubscriptionManagerListProps<TData, TSubscription> {
  idFn: (i: TData) => string;
  titleFn: (i: TData) => string;
  subtitleFn: (i: TData) => string;
  subscriptionFn?: (i: TData, resourceName: string) => TSubscription | undefined;
  key?: (i: TData, index: number) => string | number;
  withSearch?: boolean;
}
