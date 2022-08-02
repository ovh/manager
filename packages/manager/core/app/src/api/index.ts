export type FetchPaginatedParams = {
  route: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortReverse?: boolean;
};

export async function fetchPaginated({
  route,
  page,
  pageSize,
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
  const response = await fetch(`/engine/api${route}`, { headers });
  const data = await response.json();
  const totalCount =
    parseInt(response.headers.get('x-pagination-elements'), 10) || 0;
  return { data, totalCount };
}

export default fetchPaginated;
