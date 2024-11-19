import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { THealthMonitorType } from '@/api/data/health-monitor';
import { HEALTH_MONITOR_TYPE } from '@/constants';

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const compareFunction = <T>(key: keyof T) => (a: T, b: T) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue;
  }
  return aValue.toString().localeCompare(bValue.toString());
};

export const sortResults = <T>(items: T[], sorting: ColumnSort): T[] => {
  const data = [...items];

  if (sorting) {
    const { id: sortKey, desc } = sorting;
    data.sort(compareFunction<T>(sortKey as keyof T));

    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const isTypeHttpOrHttps = (type: THealthMonitorType) =>
  [HEALTH_MONITOR_TYPE.HTTP, HEALTH_MONITOR_TYPE.HTTPS].includes(type);
