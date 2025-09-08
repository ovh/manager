import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { UseDatagridTableProps } from './useDatagrid.props';

export const useDatagrid = <T,>({
  columns,
  data,
  sorting,
  onSortChange,
  manualSorting,
}: UseDatagridTableProps<T>) => {
  const manuelSortingConfig = onSortChange
    ? {
        getSortedRowModel: getSortedRowModel(),
        manualSorting,
        onSortingChange: onSortChange,
        state: {
          sorting,
        },
      }
    : {};
  return useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...manuelSortingConfig,
  });
};
