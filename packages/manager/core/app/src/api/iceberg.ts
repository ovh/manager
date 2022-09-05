import { Filter, FilterComparator } from '@/api/filters';
import apiClient from '@/api/client';

export type IcebergOptions = {
  page?: number;
  pageSize?: number;
  search?: {
    key: string;
    value: string;
  };
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
};

export type IcebergFetchParams = { route: string } & IcebergOptions;

export type IcebergFetchResult<T> = {
  data: T[];
  totalCount: number;
};

function icebergFilter(comparator: FilterComparator, value: string | string[]) {
  const v = encodeURIComponent(`${value}`);
  switch (comparator) {
    case FilterComparator.Includes:
      return `like=%25${v}%25`;
    case FilterComparator.StartsWith:
      return `like=${v}%25`;
    case FilterComparator.EndsWith:
      return `like=%25${v}`;
    case FilterComparator.IsEqual:
      return `eq=${v}`;
    case FilterComparator.IsDifferent:
      return `ne=${v}`;
    case FilterComparator.IsLower:
      return `lt=${v}`;
    case FilterComparator.IsHigher:
      return `gt=${v}`;
    case FilterComparator.IsBefore:
      return `lt=${v}`;
    case FilterComparator.IsAfter:
      return `gt=${v}`;
    case FilterComparator.IsIn: {
      const arr = (value as string[]).map(encodeURIComponent).join(',');
      return `in=${arr}`;
    }
    default:
      throw new Error(`Missing comparator implementation: '${comparator}'`);
  }
}

export async function fetchIceberg<T>({
  route,
  page,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: IcebergFetchParams): Promise<IcebergFetchResult<T>> {
  const requestHeaders: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-number': `${encodeURIComponent(page || 1)}`,
    'x-pagination-size': `${encodeURIComponent(pageSize || 5000)}`,
  };
  if (sortBy) {
    requestHeaders['x-pagination-sort'] = encodeURIComponent(sortBy);
    requestHeaders['x-pagination-sort-order'] = sortReverse ? 'DESC' : 'ASC';
  }
  if (filters && filters.length) {
    requestHeaders['x-pagination-filter'] = filters
      .map(
        ({ comparator, key, value }) =>
          `${encodeURIComponent(key)}:${icebergFilter(comparator, value)}`,
      )
      .join('&');
  }
  const { data, headers } = await apiClient.v6.get(route, {
    headers: requestHeaders,
  });
  const totalCount = parseInt(headers['x-pagination-elements'], 10) || 0;
  return { data, totalCount };
}

export default fetchIceberg;
