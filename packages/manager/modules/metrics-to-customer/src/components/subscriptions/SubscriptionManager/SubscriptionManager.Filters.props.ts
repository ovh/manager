import { ReactNode } from 'react';
import { FilterValues } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.props';

export interface SubscriptionManagerFiltersProps {
  filterValues: FilterValues;
  onFilterChange: (filterKey: string, value: string | null) => void;
  children?: (props: {
    filterValues: FilterValues;
    onFilterChange: (filterKey: string, value: string | null) => void;
  }) => ReactNode;
}

