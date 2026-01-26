import { ReactNode } from 'react';

import { FilterValues } from '@/types/subscriptions/subscriptionManager.type';

export interface SubscriptionManagerFiltersProps {
  filterValues: FilterValues;
  onFilterChange: (filterKey: string, value: string | null) => void;
  children?: (props: {
    filterValues: FilterValues;
    onFilterChange: (filterKey: string, value: string | null) => void;
  }) => ReactNode;
}
