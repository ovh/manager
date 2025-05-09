import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { FilterWithLabel } from './interface';

export function formatFilter(filter: FilterWithLabel, locale?: string): string {
  if (!filter) return '';
  switch (filter.type) {
    case FilterTypeCategories.Date:
      return new Date(`${filter.value}`).toLocaleDateString(locale);
    case FilterTypeCategories.Tags:
      return filter.value
        ? `${filter.tagKey}:${filter.value}`
        : filter.tagKey || '';
    default:
      return filter.value as string;
  }
}
