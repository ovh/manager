import { useMemo, useState } from 'react';

import type { TUseSharesQueryParams } from '@/data/hooks/shares/useShares';

type SortingState = { id: string; desc: boolean };

const COLUMN_ID_TO_SORT_FIELD: Record<string, TUseSharesQueryParams['sort']> = {
  name_id: 'name',
  region: 'region',
  allocated_capacity: 'size',
};

const DEFAULT_SORTING: SortingState = { id: 'name_id', desc: false };

const ALLOWED_SORTED_COLUMNS = ['name_id', 'region', 'allocated_capacity'];

type UseShareDatagridSortingReturn = {
  sort: TUseSharesQueryParams['sort'];
  sortOrder: TUseSharesQueryParams['sortOrder'];
  sortingProps: {
    sorting: SortingState[];
    setSorting: (newSorting: SortingState[]) => void;
  };
};

export const useShareDatagridSorting = (): UseShareDatagridSortingReturn => {
  const [sorting, setSortingState] = useState<SortingState>(DEFAULT_SORTING);

  const { sort, sortOrder } = useMemo(() => {
    const field = sorting && COLUMN_ID_TO_SORT_FIELD[sorting.id];

    if (!field) {
      return { sort: 'name' as const, sortOrder: 'asc' as const };
    }

    return {
      sort: field,
      sortOrder: sorting.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [sorting]);

  const sortingProps = useMemo(
    () => ({
      sorting: [sorting],
      setSorting: (newSorting: SortingState[]) => {
        setSortingState((prev) => {
          const newSort = newSorting?.[0];
          if (!newSort) return { ...prev, desc: !prev.desc };
          if (!ALLOWED_SORTED_COLUMNS.includes(newSort.id)) return prev;
          if (prev.id === newSort.id) return { ...prev, desc: !prev.desc };
          return newSort;
        });
      },
    }),
    [sorting],
  );

  return { sort, sortOrder, sortingProps };
};
