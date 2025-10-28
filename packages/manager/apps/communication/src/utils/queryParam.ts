import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { ColumnSort } from '@ovh-ux/manager-react-components';

export const sanitizeQueryParams = (
  queryParams: Record<string, string | number | undefined | Array<string>>,
): Array<string> => {
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          acc.push(`${key}=${String(item)}`);
        }
      });
    } else {
      acc.push(`${key}=${String(value)}`);
    }

    return acc;
  }, [] as Array<string>);
};

export const commonFilterToNotificationFilter = (filters: Filter[]) => {
  return filters.map(({ key, value, comparator }) => {
    if (key === 'createdAt' && comparator === FilterComparator.IsBefore) {
      return `createdBefore=${value}`;
    }
    if (key === 'createdAt' && comparator === FilterComparator.IsAfter) {
      return `createdAfter=${value}`;
    }
    if (comparator === FilterComparator.IsEqual) {
      return `${key}=${value}`;
    }
    return '';
  });
};

export const commonSortingToNotificationSorting = (
  sorting: ColumnSort,
): string => {
  if (!sorting || sorting.id !== 'createdAt') return '';
  return `sortCreatedAt=${sorting.desc ? 'DESC' : 'ASC'}`;
};
