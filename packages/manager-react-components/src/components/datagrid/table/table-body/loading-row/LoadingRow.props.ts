import { Column } from '@tanstack/react-table';

export type LoadingRowProps<T> = {
  columns: Column<T>[];
  pageSize?: number;
};
