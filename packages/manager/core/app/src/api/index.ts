export type FetchPaginatedParams = {
  route: string;
  page: number;
  pageSize: number;
  search?: {
    key: string;
    value: string;
  };
  sortBy?: string;
  sortReverse?: boolean;
};

export async function fetchPaginated({
  route,
  page,
  pageSize,
  search,
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
  if (search) {
    headers['x-pagination-filter'] = `${encodeURIComponent(
      search.key,
    )}:like=%25${encodeURIComponent(search.value)}%25`;
  }
  const response = await fetch(`/engine/api${route}`, { headers });
  const data = await response.json();
  const totalCount =
    parseInt(response.headers.get('x-pagination-elements'), 10) || 0;
  return { data, totalCount };
}

export default fetchPaginated;
