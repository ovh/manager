import { ColumnSort } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';

const MIN_PAGE = 0;
export const PAGE_SIZES = [10, 25, 50, 100, 300];

const DEFAULT_PARAMS: Record<string, string> = {
  page: (MIN_PAGE + 1).toString(),
  pageSize: PAGE_SIZES[0].toString(),
  sortOrder: 'asc',
};

const getSearchParamsObject = (search: URLSearchParams) =>
  Object.fromEntries([...search.entries()]);

const cleanDefaultSearchParams = (params: Record<string, string>) =>
  Object.keys(params)
    .filter((key) => {
      return !(
        Object.keys(DEFAULT_PARAMS).includes(key) &&
        DEFAULT_PARAMS[key] === params[key]
      );
    })
    .reduce((filteredParams, key) => {
      return { ...filteredParams, [key]: params[key] };
    }, {});

export const useDataGridParams = () => {
  const isValid = true;
  const [searchParams, setSearchParams] = useSearchParams();

  // get Pagination
  const pagination = {
    page: MIN_PAGE,
    pageSize: PAGE_SIZES[0],
  };
  if (searchParams.has('page')) {
    const numPage = parseInt(searchParams.get('page') || '', 10);
    pagination.page = numPage - 1;
    if (Number.isNaN(numPage) || numPage - 1 < MIN_PAGE) {
      pagination.page = MIN_PAGE;
    }
  }

  if (searchParams.has('pageSize')) {
    let pageSize = parseInt(searchParams.get('pageSize') || '', 10);
    if (!PAGE_SIZES.includes(pageSize)) {
      [pageSize] = PAGE_SIZES;
    }
    pagination.pageSize = pageSize;
  }

  // sorting (1 column)
  const sorting: ColumnSort[] = [];
  if ((searchParams.get('sort') || '') !== '') {
    sorting.push({
      id: searchParams.get('sort') || '',
      desc: (searchParams.get('sortOrder') || '') === 'desc',
    });
  } else {
    sorting.push({
      id: 'validityTo',
      desc: false,
    });
  }

  return {
    pagination,
    sorting,
    isValid,

    setPagination: (page: number, pageSize: number) => {
      setSearchParams(
        cleanDefaultSearchParams({
          ...getSearchParamsObject(searchParams),
          page: (page + 1).toString(),
          pageSize: pageSize.toString(),
        }),
      );
    },

    setSorting: (id: string, desc: boolean) => {
      setSearchParams(
        cleanDefaultSearchParams({
          ...getSearchParamsObject(searchParams),
          sort: id,
          sortOrder: desc ? 'desc' : 'asc',
        }),
      );
    },
  };
};

export default useDataGridParams;
