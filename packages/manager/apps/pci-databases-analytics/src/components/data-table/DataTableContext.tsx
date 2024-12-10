import {
  ColumnDef,
  SortingState,
  Table,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { useColumnFilters } from './useColumnFilters.hook';
import { applyFilters } from '@/lib/filters';
import { ColumnFilter } from './filters';
import { DataTable } from './DataTable';
import { DataTablePagination } from './DatatablePagination';

interface DataTableProviderProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  itemNumber?: number;
  filtersDefinition?: ColumnFilter[];
  children?: ReactNode;
}

interface DataTableContextValue<TData> {
  table: Table<TData>;
  filtersDefinition?: ColumnFilter[];
  columnFilters: ReturnType<typeof useColumnFilters>;
  globalFilter: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export function DataTableProvider<TData, TValue>({
  columns,
  data,
  pageSize,
  filtersDefinition,
  children,
}: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: columns[0]?.id as string,
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const columnFilters = useColumnFilters();

  const filteredData = useMemo(
    () => applyFilters(data || [], columnFilters.filters) as TData[],
    [columnFilters.filters, data],
  );
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
    onGlobalFilterChange: (e) => {
      setGlobalFilter(e);
    },
    globalFilterFn: 'auto',
  });
  const contextValue: DataTableContextValue<TData> = {
    table,
    filtersDefinition,
    columnFilters,
    globalFilter,
  };
  return (
    <DataTableContext.Provider value={contextValue}>
      {children || (
        <>
          <DataTable />
          <DataTablePagination />
        </>
      )}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData>() {
  const context = useContext<DataTableContextValue<TData>>(DataTableContext);
  if (!context) {
    throw new Error(
      'useDataTableContext must be used within a DataTableProvider',
    );
  }
  return context as DataTableContextValue<TData>;
}
