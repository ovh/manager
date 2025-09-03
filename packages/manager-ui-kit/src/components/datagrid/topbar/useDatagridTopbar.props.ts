import { Column } from '@tanstack/react-table';
import { DatagridColumn } from '../Datagrid.props';

export type UseDatagridTopbarProps<T> = {
  columns?: readonly DatagridColumn<T>[];
  visibleColumns?: Column<T, unknown>[];
};
