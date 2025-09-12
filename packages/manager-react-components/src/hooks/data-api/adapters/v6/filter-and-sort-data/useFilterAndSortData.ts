import { useMemo } from 'react';
import {
  applyFilters,
  FilterTypeCategories,
  Filter,
} from '@ovh-ux/manager-core-api';
import { ColumnSort, DatagridColumn } from '../../../../../components';
import { compare } from './filterAndSort.utils';

export const useFilterAndSortData = <TData = Record<string, unknown>>({
  items = [],
  filters,
  searchFilters,
  sorting,
  columns,
}: {
  items: TData[] | undefined;
  filters: Filter[];
  searchFilters: Filter[];
  sorting: ColumnSort | undefined;
  columns: DatagridColumn<TData>[];
}) => {
  const filteredData: TData[] = useMemo(() => {
    if (!filters.length && !searchFilters.length) return items;
    return applyFilters(items, [...filters, ...searchFilters]);
  }, [items, filters, searchFilters]);

  const filteredAndSortedData: TData[] = useMemo(() => {
    if (sorting) {
      const columnType =
        columns.find((col) => col.id === sorting.id)?.type ||
        FilterTypeCategories.String;
      return [...filteredData].sort((a: TData, b: TData) =>
        compare(
          columnType,
          `${(a as Record<string, unknown>)?.[sorting.id]}`,
          `${(b as Record<string, unknown>)?.[sorting.id]}`,
          sorting.desc,
        ),
      );
    }
    return filteredData;
  }, [filteredData, sorting]);

  return {
    filteredAndSortedData,
  };
};
