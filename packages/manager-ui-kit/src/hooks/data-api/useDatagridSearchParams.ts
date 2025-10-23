import { useSearchParams } from 'react-router-dom';

import { ColumnSort } from '@tanstack/react-table';

/**
 * This hooks allows to store and synchronize the datagrid sorting
 * state within URL search parameters. Thus the user is able to refresh his page
 * without loosing his current column sorting state.
 */

/* Convert URL search params to plain object */
const getSearchParamsObject = (search: URLSearchParams) =>
  Object.fromEntries([...search.entries()]);

/* Parse column sorting from URL search params */
const parseSorting = (params: URLSearchParams, defaultSorting?: ColumnSort): ColumnSort => {
  const sorting: ColumnSort = {
    id: '',
    desc: false,
  };
  if (params.has('sort')) {
    const sortParam = params.get('sort');
    if (sortParam) {
      sorting.id = sortParam;
      if (params.has('sortOrder')) {
        sorting.desc = params.get('sortOrder') === 'desc';
      }
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
    sorting: parseSorting(searchParams, defaultSorting),
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
