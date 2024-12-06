import { ReactNode, useState } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  Table as TanStackTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';
import { DataTablePagination } from './pagination';
import { useColumnFilters } from './useColumnFilters.hook';
import { applyFilters } from '@/lib/filters';
import { Filter, FilterWithLabel } from './filter-list';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  itemNumber?: number;
  headerContent?: (
    table: TanStackTable<TData>,
    globalFilter: string,
    filters: FilterWithLabel[],
    addFilter: (filter: FilterWithLabel) => void,
    removeFilter: (filter: Filter) => void,
  ) => ReactNode;
}

export const MENU_COLUMN_ID = 'actions';

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  itemNumber,
  headerContent,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('pci-databases-analytics/components/data-table');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const filteredData = applyFilters(data || [], filters) as TData[];
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: pageSize ?? 5 },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'auto',
  });

  return (
    <>
      {headerContent &&
        headerContent(table, globalFilter, filters, addFilter, removeFilter)}
      <div>
        <Table>
          <TableHeader className="border bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isEmptyHeader = header.id === MENU_COLUMN_ID;
                  return (
                    <TableHead
                      key={header.id}
                      className={`border font-semibold text-primary-800 ${
                        isEmptyHeader && index > 0 ? 'border-l-0' : ''
                      }`}
                    >
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
          <TableBody className="border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="b"
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
      <TableHeader className="border bg-gray-50">
        <TableRow>
          {Array.from({ length: columns }).map((colHead, iColHead) => (
            <TableHead
              key={`${colHead}${iColHead}`}
              className="border font-semibold text-primary-800"
            >
              <Skeleton
                className="block"
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
                  className="block"
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
