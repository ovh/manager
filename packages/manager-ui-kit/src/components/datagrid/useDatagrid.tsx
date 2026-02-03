import { useMemo } from 'react';

import { useReactTable } from '@tanstack/react-table';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { ExpandableRow } from '@/components/datagrid/Datagrid.props';

import { useTableBuilder } from './builder/useTableBuilder';
import { UseDatagridTableProps } from './useDatagrid.props';

export const useDatagrid = <T extends ExpandableRow<T>>({
  columns,
  columnVisibility,
  data,
  expandable,
  manualSorting,
  onSortChange,
  renderSubComponent,
  rowSelection,
  sizeRow,
  setColumnVisibility,
  sorting,
  searchParams,
}: UseDatagridTableProps<T>) => {
  const { hasSortingFeature, hasSearchFeature, hasColumnVisibilityFeature, hasFilterFeature } =
    useMemo(() => {
      const has = <K extends 'isSortable' | 'isSearchable' | 'enableHiding' | 'isFilterable'>(
        key: K,
      ): boolean => columns?.some((col) => Boolean(col[key])) ?? false;
      return {
        hasSortingFeature: has('isSortable'),
        hasSearchFeature: has('isSearchable') || searchParams !== '',
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
    renderSubComponent,
    rowSelection,
    setColumnVisibility: setColumnVisibility ?? (() => {}),
    sorting: sorting ?? [],
    size: sizeRow ?? TABLE_SIZE.md,
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
    .setRowId()
    .build();

  const table = useReactTable(builder);

  return {
    table,
    features: {
      hasSortingFeature,
      hasSearchFeature,
      hasColumnVisibilityFeature,
      hasFilterFeature,
      hasExpandableFeature,
    },
  };
};
