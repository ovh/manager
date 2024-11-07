import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';
import {
  ColumnDef,
  SortingColumn,
  SortingState,
  flexRender,
  Table as TanStackTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from './skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useTranslation } from 'react-i18next';

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  itemNumber?: number
}
export function DataTablePagination<TData>({
  table,
  itemNumber,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('pci-databases-analytics/components/data-table');
  return (
    <div className="flex justify-end mt-4">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
        {itemNumber > 0 && (
          <div className="flex px-4 items-center justify-center text-sm font-medium">
            <span>{t('itemCount', { count: itemNumber })}</span>
          </div>
        )}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100, 300].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex px-4 items-center justify-center text-sm font-medium">
          <span>{t('currentPage', { currentPage: table.getState().pagination.pageIndex + 1, totalPagesCount: table.getPageCount()})}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('goToFirstPage')}</span>
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
          <span className="sr-only">{t('goToPreviousPage')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('goToNextPage')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('goToLastPage')}</span>
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  itemNumber?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  itemNumber,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('pci-databases-analytics/components/data-table');
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: { pageSize: pageSize ?? 5 },
    },
  });

  return (
    <>
      <div>
        <Table>
          <TableHeader className="bg-primary-100 text-primary-700 border border-primary-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-primary-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border border-primary-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-primary-100"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                 {t('noResult')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} itemNumber={itemNumber} />
    </>
  );
}

interface SortableHeaderProps<TData> {
  column: SortingColumn<TData>;
  children: React.ReactNode;
}
export function SortableHeader<TData>({
  column,
  children,
}: SortableHeaderProps<TData>) {
  const sort = column.getIsSorted();
  let icon = <ChevronsUpDown className="ml-2 h-4 w-4" />;
  if (sort === 'asc') {
    icon = <ChevronUp className="ml-2 h-4 w-4" />;
  } else if (sort === 'desc') {
    icon = <ChevronDown className="ml-2 h-4 w-4" />;
  }

  const buttonClass = `px-0 font-bold hover:bg-primary-100 ${
    sort
      ? 'text-primary-500 hover:text-primary-500'
      : 'text-primary-700 hover:text-primary-500'
  }`;
  return (
    <Button
      variant="ghost"
      className={buttonClass}
      onClick={() => column.toggleSorting(sort === 'asc')}
    >
      {children}
      {icon}
    </Button>
  );
}

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  height?: number;
  width?: number;
}
DataTable.Skeleton = function DataTableSkeleton({
  columns = 5,
  rows = 5,
  height = 16,
  width = 80,
}: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader className="bg-primary-100 text-primary-700">
        <TableRow className="hover:bg-primary-100">
          {Array.from({ length: columns }).map((colHead, iColHead) => (
            <TableHead
              key={`${colHead}${iColHead}`}
              className="text-primary-foreground first:rounded-tl-sm last:rounded-tr-sm"
            >
              <Skeleton
                style={{ width: `${width}px`, height: `${height}px` }}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="border border-primary-100">
        {Array.from({ length: rows }).map((row, iRow) => (
          <TableRow key={`${row}${iRow}`}>
            {Array.from({ length: columns }).map((col, iCol) => (
              <TableCell key={`${col}${iCol}`}>
                <Skeleton
                  style={{ width: `${width}px`, height: `${height}px` }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};