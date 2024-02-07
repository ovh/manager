import { useState } from 'react';
import {
  ColumnDef,
  SortingColumn,
  SortingState,
  flexRender,
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
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize? : number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
}: DataTableProps<TData, TValue>) {
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
          <TableHeader className="bg-primary-100 text-primary-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-primary-700"
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
          <TableBody className="border border-primary-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                className='border-primary-100'
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
interface SortableHeaderProps<TData> {
  column: SortingColumn<TData>;
  children: React.ReactNode;
}

export function SortableHeader<TData> ({column, children}: SortableHeaderProps<TData>) {
  const sort = column.getIsSorted();
  let icon = <ChevronsUpDown className="ml-2 h-4 w-4" />;
  if (sort === 'asc') {
      icon = <ChevronUp className="ml-2 h-4 w-4" />;
  } else if (sort === 'desc') {
      icon = <ChevronDown className="ml-2 h-4 w-4" />;
  }

  const buttonClass = `px-0 font-bold hover:bg-primary-100 ${sort ? 'text-primary-500 hover:text-primary-500' : 'text-primary-700 hover:text-primary-500'}`  
  return (
      <Button
          variant="ghost"
          className={buttonClass}
          onClick={() => column.toggleSorting(sort === 'asc')}
      >
          {children}
          {icon}
      </Button>
  )
}

interface DataTableSkeletonProps {
  columns?: number,
  rows?: number,
  height?: number,
  width?: number
}
DataTable.Skeleton = function DataTableSkeleton ({
  columns = 5,
  rows = 5,
  height = 16,
  width = 80,
}: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader className="bg-primary-100 text-primary-700">
          <TableRow className="hover:bg-primary-100">
              {Array.from({length: columns}).map((_, iColHead) => (
                <TableHead key={iColHead} className="text-primary-foreground first:rounded-tl-sm last:rounded-tr-sm">
                    <Skeleton style={{width: `${width}px`, height: `${height}px`}} />
                </TableHead>
              ))}
          </TableRow>
      </TableHeader>
      <TableBody className="border border-primary-100">
        {Array.from({length: rows}).map((_, iRow) => (
            <TableRow key={iRow} >
              {Array.from({length: columns}).map((_, iCol) => (
                <TableCell key={iCol} ><Skeleton style={{width: `${width}px`, height: `${height}px`}} /></TableCell>
              ))}
            </TableRow>
            ))}
      </TableBody>
    </Table>
  )
}