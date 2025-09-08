import { Column, Header } from '@tanstack/react-table';

export type TableHeaderSortingProps<T> = {
  header: Header<T, unknown>;
  onSortChange?: (column: Column<T>) => void;
};
