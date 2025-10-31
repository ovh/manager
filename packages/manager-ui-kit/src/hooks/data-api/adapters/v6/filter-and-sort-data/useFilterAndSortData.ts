import { useMemo } from 'react';

import type { ColumnSort, SortingState } from '@tanstack/react-table';

import { FilterTypeCategories, applyFilters } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';

import { compare, toComparableString } from './filterAndSort.utils';

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
    if (!filters.length && !searchFilters.length) return items ?? [];
    return applyFilters(items ?? [], [...filters, ...searchFilters]);
  }, [items, filters, searchFilters]);

  const filteredAndSortedData: TData[] = useMemo(() => {
    if (!sorting?.length) return filteredData;

    const sort: ColumnSort = sorting[0] ?? ({} as ColumnSort);
    const sortId = sort.id;
    const desc = sort.desc ?? false;

    if (!sortId) return filteredData;

    const columnType =
      columns.find((col) => col.id === sortId)?.type ?? FilterTypeCategories.String;

    return [...filteredData].sort((a: TData, b: TData) =>
      compare(
        columnType,
        toComparableString((a as Record<string, unknown>)[sortId]),
        toComparableString((b as Record<string, unknown>)[sortId]),
        desc,
      ),
    );
  }, [filteredData, sorting, columns]);

  return { filteredAndSortedData };
};
