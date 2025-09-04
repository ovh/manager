import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from '@tanstack/react-table';

type UseDatagridTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
};

export const useDatagridTable = <T,>({
  columns,
  data,
}: UseDatagridTableProps<T>) => {
  return useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
};
