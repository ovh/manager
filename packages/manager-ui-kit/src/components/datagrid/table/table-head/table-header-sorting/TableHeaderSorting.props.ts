import type { Header, SortingState } from '@tanstack/react-table';

export interface TableHeaderSortingProps<T> {
  header: Header<T, unknown>;
  onSortChange: (sorting: SortingState) => void;
}
