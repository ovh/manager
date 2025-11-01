import { MutableRefObject } from 'react';

import { ColumnSort, Row, VisibilityState } from '@tanstack/react-table';

import { DatagridColumn, ExpandedProps, RowSelectionProps } from './Datagrid.props';

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
  ) => JSX.Element;
  rowSelection?: RowSelectionProps<T>;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  sorting?: ColumnSort[];
};

export interface ExpandableRow<T> {
  id: string;
  subRows?: T[];
}
