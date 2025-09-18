import { MutableRefObject } from 'react';
import { ColumnSort, Row } from '@tanstack/react-table';
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
};
