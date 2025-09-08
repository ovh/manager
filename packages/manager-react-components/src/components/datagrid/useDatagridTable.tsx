import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  ColumnSort,
} from '@tanstack/react-table';

type UseDatagridTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
};

export const useDatagridTable = <T,>({
  columns,
  data,
  sorting,
  onSortChange,
  manualSorting,
}: UseDatagridTableProps<T>) => {
  const manuelSortingConfig = !manualSorting
    ? {
        onSortingChange: onSortChange,
        state: {
          sorting,
        },
        getSortedRowModel: getSortedRowModel(),
      }
    : {};
  return useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...manuelSortingConfig,
  });
};
