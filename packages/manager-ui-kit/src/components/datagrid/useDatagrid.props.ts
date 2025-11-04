import { JSX, MutableRefObject } from 'react';

import type { ColumnSort, Row, VisibilityState } from '@tanstack/react-table';

import {
  DatagridColumn,
  ExpandableRow,
  ExpandedProps,
  RowSelectionProps,
} from '@/components/datagrid/Datagrid.props';

export type UseDatagridTableProps<T extends ExpandableRow<T>> = {
  columns: readonly DatagridColumn<T>[];
  columnVisibility?: VisibilityState;
  data: T[];
  expandable?: ExpandedProps;
  manualSorting?: boolean;
  onSortChange?: (sorting: ColumnSort[]) => void;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element | null;
  rowSelection?: RowSelectionProps<T> | null;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  sorting?: ColumnSort[];
};
