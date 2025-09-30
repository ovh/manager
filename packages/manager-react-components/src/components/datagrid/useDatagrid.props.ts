import { MutableRefObject } from 'react';
import { ColumnSort, Row, VisibilityState } from '@tanstack/react-table';
import { ManagerColumnDef } from './Datagrid.props';
import { RowSelectionProps } from './Datagrid.props';

export type UseDatagridTableProps<T> = {
  columns: ManagerColumnDef<T>[];
  columnVisibility?: VisibilityState;
  data: T[];
  expandable?: boolean;
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
  subRows?: T[];
}
