import { useCallback, useMemo, useState } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { FilterComparator } from '@ovh-ux/manager-core-api';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import { useColumnFilters } from '@/hooks/data-api/useColumnFilters';

export interface SearchFilter {
  key: string;
  value: string;
  comparator: FilterComparator;
}

export const useDataRetrievalOperations = <TData = Record<string, unknown>>({
  defaultSorting,
  columns = [],
}: {
  defaultSorting: SortingState | undefined;
  columns: DatagridColumn<TData>[];
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState | undefined>(defaultSorting);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.isSearchable),
    [columns],
  );

  const onSearch = useCallback(
    (search: string | undefined) => {
      setSearchFilters(
        !search
          ? []
          : searchableColumns.map(({ id }) => ({
              key: id,
              value: search,
              comparator: FilterComparator.Includes,
            })),
      );
    },
    [searchableColumns],
  );

  return {
    searchInput,
    setSearchInput,
    searchFilters,
    setSearchFilters,
    sorting,
    setSorting,
    filters,
    addFilter,
    removeFilter,
    onSearch,
  };
};
