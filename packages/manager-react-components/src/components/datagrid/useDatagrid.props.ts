import { MutableRefObject } from 'react';
import { ColumnSort, Row, VisibilityState } from '@tanstack/react-table';
import { ManagerColumnDef } from './Datagrid.props';

export type UseDatagridTableProps<T> = {
  columns: ManagerColumnDef<T>[];
  data: T[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  expandable?: boolean;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
};

export interface ExpandableRow<T> {
  subRows?: T[];
}
