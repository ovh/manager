import { Column } from '@tanstack/react-table';

export type LoadingTableRowProps<T> = {
  pageSize?: number;
  columns: Column<T>[];
};
