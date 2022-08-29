import { Filter, FilterComparator } from '@/api/filters';
import apiClient from '@/api/client';

export type FetchPaginatedParams = {
  route: string;
  page: number;
  pageSize: number;
  search?: {
    key: string;
    value: string;
  };
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
};

function icebergFilter(comparator: FilterComparator, value: string) {
  const v = encodeURIComponent(value);
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
    default:
      throw new Error(`Missing comparator implementation: '${comparator}'`);
  }
}

export async function fetchIceberg({
  route,
  page,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: FetchPaginatedParams) {
  const requestHeaders: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-number': `${encodeURIComponent(page)}`,
    'x-pagination-size': `${encodeURIComponent(pageSize)}`,
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
