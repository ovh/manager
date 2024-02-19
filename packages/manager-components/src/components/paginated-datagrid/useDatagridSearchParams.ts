import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';

/**
 * This hooks allows to store and synchronize the datagrid pagination & sorting
 * state within URL search parameters. Thus the user is able to refresh his page
 * without loosing his current pagination and column sorting state.
 */

/* List of allowed page sizes */
const PAGE_SIZES = [10, 25, 50, 100, 300];

/* Convert URL search params to plain object */
const getSearchParamsObject = (search: URLSearchParams) =>
  Object.fromEntries([...search.entries()]);

/* Parse pagination from URL search params */
const parsePagination = (params: URLSearchParams): PaginationState => {
  const pagination: PaginationState = {
    pageIndex: 0,
    pageSize: PAGE_SIZES[0],
  };
  if (params.has('page')) {
    let pageIndex = parseInt(params.get('page'), 10) - 1;
    if (Number.isNaN(pageIndex) || pageIndex < 0) pageIndex = 0;
    pagination.pageIndex = pageIndex;
  }
  if (params.has('pageSize')) {
    let pageSize = parseInt(params.get('pageSize'), 10) - 1;
    if (!PAGE_SIZES.includes(pageSize)) [pageSize] = PAGE_SIZES;
    pagination.pageSize = pageSize;
  }
  return pagination;
};

/* Parse column sorting from URL search params */
const parseSorting = (
  params: URLSearchParams,
  defaultSorting?: ColumnSort,
): ColumnSort => {
  const sorting: ColumnSort = {
    id: null,
    desc: false,
  };
  if (params.has('sort')) {
    sorting.id = params.get('sort');
    if (params.has('sortOrder')) {
      sorting.desc = params.get('sortOrder') === 'desc';
    }
  } else if (defaultSorting) {
    return defaultSorting;
  }
  return sorting;
};

/** Use URL search params to store datagrid pagination & column sorting */
export const useDatagridSearchParams = (defaultSorting?: ColumnSort) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    pagination: parsePagination(searchParams),
    sorting: parseSorting(searchParams, defaultSorting),
    setPagination: ({ pageIndex, pageSize }: PaginationState) => {
      if (pageIndex > 0) searchParams.set('page', `${pageIndex + 1}`);
      else searchParams.delete('page');
      if (PAGE_SIZES.includes(pageSize) && pageSize !== PAGE_SIZES[0])
        searchParams.set('pageSize', `${pageSize}`);
      else searchParams.delete('pageSize');
      setSearchParams({
        ...getSearchParamsObject(searchParams),
      });
    },
    setSorting: ({ id, desc }: ColumnSort) => {
      if (id) {
        searchParams.set('sort', id);
        if (desc) {
          searchParams.set('sortOrder', 'desc');
        } else {
          searchParams.delete('sortOrder');
        }
      } else {
        searchParams.delete('sort');
        searchParams.delete('sortOrder');
      }
      setSearchParams({
        ...getSearchParamsObject(searchParams),
      });
    },
  };
};
