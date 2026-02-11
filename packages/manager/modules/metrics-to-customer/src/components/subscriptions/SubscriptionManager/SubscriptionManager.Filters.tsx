import { SubscriptionManagerFiltersProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Filters.props';

export function SubscriptionManagerFilters({
  filterValues,
  onFilterChange,
  children
}: SubscriptionManagerFiltersProps) {
  if (!children) {
    return null;
  }

  return (
    <>
      {children({ filterValues, onFilterChange })}
    </>
  );
}

export const Filters = SubscriptionManagerFilters;
