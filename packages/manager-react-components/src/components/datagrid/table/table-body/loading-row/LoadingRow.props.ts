import { Column } from '@tanstack/react-table';

export type LoadingRowProps<T> = {
  pageSize?: number;
  columns: Column<T>[];
};
