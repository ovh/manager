import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { TStorage } from '@/api/data/storages';

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

export const isSwiftType = (storage: TStorage) =>
  !storage.archive && !storage.s3StorageType;

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
