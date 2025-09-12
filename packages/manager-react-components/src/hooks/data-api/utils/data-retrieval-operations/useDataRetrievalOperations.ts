import { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  useColumnFilters,
  ColumnSort,
  DatagridColumn,
} from '../../../../components';

export const useDataRetrievalOperations = <TColumn = unknown>({
  defaultSorting,
  columns = [],
}: {
  defaultSorting: ColumnSort | undefined;
  columns: DatagridColumn<TColumn>[];
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<any>([]);
  const [sorting, setSorting] = useState<ColumnSort | undefined>(
    defaultSorting,
  );
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const searchableColumns = useMemo(
    () =>
      columns.filter((column: DatagridColumn<TColumn>) => column.isSearchable),
    [columns],
  );

  const onSearch = useCallback(
    (search: string | undefined) => {
      setSearchInput(search || '');
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

  useEffect(() => {
    onSearch(searchInput);
  }, [searchInput]);

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
