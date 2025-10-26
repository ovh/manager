import { JSX, MutableRefObject } from 'react';

import type { ColumnDef, ColumnSort, Row, VisibilityState } from '@tanstack/react-table';

import { ExpandedProps, RowSelectionProps } from '@/components/datagrid/Datagrid.props';

import { ExpandableRow } from '../useDatagrid.props';

export type TableBuilderProps<T extends ExpandableRow<T>> = {
  columns: readonly ColumnDef<T>[];
  columnVisibility: VisibilityState;
  data: T[];
  expandable: ExpandedProps;
  hasExpandableFeature: boolean;
  hasSortingFeature: boolean;
  manualSorting: boolean;
  onSortChange: (sorting: ColumnSort[]) => void;
  renderSubComponent: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  rowSelection: RowSelectionProps<T>;
  setColumnVisibility: (columnVisibility: VisibilityState) => void;
  sorting: ColumnSort[];
};
