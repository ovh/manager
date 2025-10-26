import type { ColumnSort } from '@tanstack/react-table';

import type { Filter } from '@ovh-ux/manager-core-api';

export const filterEquals = (a: Filter, b: Filter) =>
  a.key === b.key && a.value === b.value && a.comparator === b.comparator;

export const getSearchParamsObject = (search: URLSearchParams) =>
  Object.fromEntries([...search.entries()]);

export const parseSorting = (params: URLSearchParams, defaultSorting?: ColumnSort): ColumnSort => {
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
