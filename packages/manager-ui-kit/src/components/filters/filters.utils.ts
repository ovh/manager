import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { FilterWithLabel } from '@/components/filters/Filter.props';

export function formatFilter(filter: FilterWithLabel, locale?: string): string {
  if (!filter) return '';
  if (filter.displayValue) return filter.displayValue;

  const value = Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value ?? '');

  switch (filter.type) {
    case FilterTypeCategories.Date: {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(locale);
    }

    case FilterTypeCategories.Tags:
      return value ? `${filter.tagKey ?? ''}:${value}` : (filter.tagKey ?? '');

    default:
      return value;
  }
}
