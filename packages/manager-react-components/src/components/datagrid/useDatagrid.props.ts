import { ColumnDef, ColumnSort } from '@tanstack/react-table';

export type UseDatagridTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
};
