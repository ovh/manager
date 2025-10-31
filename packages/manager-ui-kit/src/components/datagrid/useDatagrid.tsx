import { useMemo } from 'react';

import { useReactTable } from '@tanstack/react-table';

import { useTableBuilder } from './builder/useTableBuilder';
import { ExpandableRow, UseDatagridTableProps } from './useDatagrid.props';

export const useDatagrid = <T extends ExpandableRow<T>>({
  columns,
  columnVisibility,
  data,
  expandable,
  manualSorting,
  onSortChange,
  renderSubComponent,
  rowSelection,
  setColumnVisibility,
  sorting,
}: UseDatagridTableProps<T>) => {
  const { hasSortingFeature, hasSearchFeature, hasColumnVisibilityFeature, hasFilterFeature } =
    useMemo(() => {
      const has = <K extends 'isSortable' | 'isSearchable' | 'enableHiding' | 'isFilterable'>(
        key: K,
      ): boolean => columns?.some((col) => Boolean(col[key])) ?? false;
      return {
        hasSortingFeature: has('isSortable'),
        hasSearchFeature: has('isSearchable'),
        hasColumnVisibilityFeature: has('enableHiding'),
        hasFilterFeature: has('isFilterable'),
      };
    }, [columns]);
  const hasExpandableFeature = useMemo(() => data?.some((row) => row?.subRows) ?? false, [data]);
  const builder = useTableBuilder({
    columns,
    data,
    columnVisibility: columnVisibility ?? {},
    expandable: expandable ?? { expanded: {}, setExpanded: () => {} },
    hasExpandableFeature,
    hasSortingFeature,
    manualSorting: manualSorting ?? false,
    onSortChange: onSortChange ?? (() => {}),
    renderSubComponent: renderSubComponent ?? (() => <></>),
    rowSelection: rowSelection ?? {
      rowSelection: {},
      setRowSelection: () => {},
    },
    setColumnVisibility: setColumnVisibility ?? (() => {}),
    sorting: sorting ?? [],
  })
    .setColumns()
    .setColumnsVisibility()
    .setCoreRowModel()
    .setData()
    .setExpanded()
    .setExpandedRowModel()
    .setRowSelection()
    .setSorting()
    .setState()
    .setSubRows()
    .build();
  const table = useReactTable(builder);

  return {
    ...table,
    features: {
      hasSortingFeature,
      hasSearchFeature,
      hasColumnVisibilityFeature,
      hasFilterFeature,
      hasExpandableFeature,
    },
  };
};
