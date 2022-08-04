import { Filter, FilterComparator } from '@/api/filters';

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

function getComparatorOperand(comparator: FilterComparator) {
  switch (comparator) {
    case FilterComparator.Includes:
      return 'like';
    default:
      // @TODO implement other comparators
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
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-number': `${page}`,
    'x-pagination-size': `${pageSize}`,
  };
  if (sortBy) {
    headers['x-pagination-sort'] = sortBy;
    headers['x-pagination-sort-order'] = sortReverse ? 'DESC' : 'ASC';
  }
  if (filters && filters.length) {
    headers['x-pagination-filter'] = filters
      .map(
        ({ comparator, key, value }) =>
          `${encodeURIComponent(key)}:${getComparatorOperand(
            comparator,
          )}=%25${encodeURIComponent(value)}%25`,
      )
      .join('&');
  }
  const response = await fetch(`/engine/api${route}`, { headers });
  const data = await response.json();
  const totalCount =
    parseInt(response.headers.get('x-pagination-elements'), 10) || 0;
  return { data, totalCount };
}

export default fetchIceberg;
