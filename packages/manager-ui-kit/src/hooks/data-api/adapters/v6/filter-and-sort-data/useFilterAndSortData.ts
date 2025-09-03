import { useMemo } from 'react';
import {
  applyFilters,
  FilterTypeCategories,
  Filter,
} from '@ovh-ux/manager-core-api';
import { SortingState } from '@tanstack/react-table';
import { DatagridColumn } from '../../../../../components';
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
  sorting: SortingState | undefined;
  columns: DatagridColumn<TData>[];
}) => {
  const filteredData: TData[] = useMemo(() => {
    if (!filters.length && !searchFilters.length) return items;
    return applyFilters(items, [...filters, ...searchFilters]);
  }, [items, filters, searchFilters]);

  const filteredAndSortedData: TData[] = useMemo(() => {
    if (sorting) {
      const columnType =
        columns.find((col) => col.id === sorting[0]?.id)?.type ||
        FilterTypeCategories.String;
      return [...filteredData].sort((a: TData, b: TData) =>
        compare(
          columnType,
          `${(a as Record<string, unknown>)?.[sorting[0]?.id]}`,
          `${(b as Record<string, unknown>)?.[sorting[0]?.id]}`,
          sorting[0]?.desc,
        ),
      );
    }
    return filteredData;
  }, [filteredData, sorting]);

  return {
    filteredAndSortedData,
  };
};
