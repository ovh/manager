import { useMemo } from 'react';
import { useReactTable, VisibilityState } from '@tanstack/react-table';
import { UseDatagridTableProps, ExpandableRow } from './useDatagrid.props';
import { useTableBuilder } from './builder';

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
  const {
    hasSortingFeature,
    hasSearchFeature,
    hasColumnVisibilityFeature,
    hasFilterFeature,
  } = useMemo(() => {
    const has = (key: string) => columns?.some((col) => col?.[key]);
    return {
      hasSortingFeature: has('isSortable'),
      hasSearchFeature: has('isSearchable'),
      hasColumnVisibilityFeature: has('enableHiding'),
      hasFilterFeature: has('isFilterable'),
    };
  }, [columns]);
  const hasExpandableFeature = useMemo(
    () => data?.some((row) => row?.subRows) ?? false,
    [data],
  );
  const builder = useTableBuilder({
    columns,
    columnVisibility,
    data,
    expandable,
    hasExpandableFeature,
    hasSortingFeature,
    manualSorting,
    onSortChange,
    renderSubComponent,
    rowSelection,
    setColumnVisibility,
    sorting,
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
