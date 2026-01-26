import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { SubscriptionUrls } from '@/types/SubscriptionUrls.type';
import { FilterValues } from '@/types/subscriptions/subscriptionManager.type';

export interface SubscriptionManagerContextValue<TData = unknown, TSubscription = unknown> {
  resourceName: string;
  filterValues: FilterValues;
  isFiltersReady: boolean;
  itemIdFn?: (item: TData) => string;
  itemSubscriptionFn?: (item: TData, targetName: string) => TSubscription | undefined;
  itemKeyFn?: (item: TData, index: number) => string | number;
  filterItems?: (items: TData[], searchQuery: string) => TData[];
  titleFn?: (item: TData) => string;
  subtitleFn?: (item: TData) => string;
  setTitleSubtitleFns?: (title: (item: TData) => string, subtitle: (item: TData) => string) => void;
  subscriptionUrls: SubscriptionUrls;
  onCreateSubscription: (params: {
    subscribeUrl: string;
    itemId: string;
    resourceName: string;
  }) => void;
  onDeleteSubscription: (params: {
    subscription: TSubscription;
    itemId: string;
    resourceName: string;
  }) => void;
  isCreatingSubscription: boolean;
  isDeletingSubscription: boolean;
  data: TData[] | undefined;
  isSuccess: boolean;
  filteredData: TData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasActiveFilters: boolean;
  hasApiData: boolean;
  hasFilteredData: boolean;
  shouldShowData: boolean;
  handleFilterChange: (filterKey: string, value: string | null) => void;
}

const SubscriptionManagerContext = createContext<SubscriptionManagerContextValue | null>(null);

export function useSubscriptionManagerContext<TData = unknown, TSubscription = unknown>() {
  const context = useContext(SubscriptionManagerContext) as SubscriptionManagerContextValue<
    TData,
    TSubscription
  > | null;
  if (!context) {
    throw new Error('SubscriptionManager sub-components must be used within SubscriptionManager');
  }
  return context;
}

interface SubscriptionManagerProviderProps<TData = unknown, TSubscription = unknown> {
  children?: ReactNode;
  resourceName?: string;
  data?: TData[];
  isSuccess?: boolean;
  isFiltersReady?: boolean;
  subscriptionUrls?: SubscriptionUrls;
  onCreateSubscription?: (params: {
    subscribeUrl: string;
    itemId: string;
    resourceName: string;
  }) => void;
  onDeleteSubscription?: (params: {
    subscription: TSubscription;
    itemId: string;
    resourceName: string;
  }) => void;
  isCreatingSubscription?: boolean;
  isDeletingSubscription?: boolean;
}

export function SubscriptionManagerProvider<TData = unknown, TSubscription = unknown>({
  children,
  resourceName: resourceNameProp = '',
  data: dataProp,
  isSuccess: isSuccessProp = true,
  isFiltersReady: isFiltersReadyProp = true,
  subscriptionUrls: subscriptionUrlsProp,
  onCreateSubscription: onCreateSubscriptionProp,
  onDeleteSubscription: onDeleteSubscriptionProp,
  isCreatingSubscription: isCreatingSubscriptionProp = false,
  isDeletingSubscription: isDeletingSubscriptionProp = false,
}: SubscriptionManagerProviderProps<TData, TSubscription>) {
  const [searchQuery, setSearchQueryState] = useState('');
  const [titleFn, setTitleFn] = useState<((item: TData) => string) | undefined>();
  const [subtitleFn, setSubtitleFn] = useState<((item: TData) => string) | undefined>();

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setTitleSubtitleFns = useCallback(
    (title: (item: TData) => string, subtitle: (item: TData) => string) => {
      setTitleFn(() => title);
      setSubtitleFn(() => subtitle);
    },
    [],
  );

  const filteredData = useMemo(() => {
    if (!dataProp || !titleFn || !subtitleFn) return [];
    if (!searchQuery.trim()) return dataProp;

    const query = searchQuery.toLowerCase();
    return dataProp.filter((item) => {
      const title = titleFn(item).toLowerCase();
      const subtitle = subtitleFn(item).toLowerCase();
      return title.includes(query) || subtitle.includes(query);
    });
  }, [dataProp, searchQuery, titleFn, subtitleFn]);

  const hasApiData = Boolean(dataProp && dataProp.length > 0);
  const hasFilteredData = Boolean(filteredData && filteredData.length > 0);
  const shouldShowData = isFiltersReadyProp && isSuccessProp && hasApiData;

  const contextValue: SubscriptionManagerContextValue<TData, TSubscription> = {
    resourceName: resourceNameProp,
    filterValues: {},
    isFiltersReady: isFiltersReadyProp,
    titleFn,
    subtitleFn,
    setTitleSubtitleFns,
    subscriptionUrls: subscriptionUrlsProp ?? ({} as SubscriptionUrls),
    onCreateSubscription: onCreateSubscriptionProp ?? (() => {}),
    onDeleteSubscription: onDeleteSubscriptionProp ?? (() => {}),
    isCreatingSubscription: isCreatingSubscriptionProp,
    isDeletingSubscription: isDeletingSubscriptionProp,
    data: dataProp,
    isSuccess: isSuccessProp,
    filteredData,
    searchQuery,
    setSearchQuery,
    hasActiveFilters: false,
    hasApiData,
    hasFilteredData,
    shouldShowData,
    handleFilterChange: () => {},
  };

  return (
    <SubscriptionManagerContext.Provider value={contextValue as SubscriptionManagerContextValue}>
      {children}
    </SubscriptionManagerContext.Provider>
  );
}

export { SubscriptionManagerContext };
