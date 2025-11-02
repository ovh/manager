import type { Column } from '@tanstack/react-table';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';

export type UseDatagridTopbarProps<T> = {
  columns?: readonly DatagridColumn<T>[];
  visibleColumns?: Column<T, unknown>[];
};
