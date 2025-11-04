import { useSearchParams } from 'react-router-dom';

import type { ColumnSort } from '@tanstack/react-table';

import { getSearchParamsObject, parseSorting } from '@/hooks/data-api/utils/DataApi.utils';

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
