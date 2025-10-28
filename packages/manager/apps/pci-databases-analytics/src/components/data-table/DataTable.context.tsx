import {
  ColumnDef,
  Row,
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
import { ColumnFilter } from './DatatableDefaultFilterButton.component';
import { DataTable } from './DataTable.component';
import { DataTablePagination } from './DatatablePagination.component';

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
  data: TData[];
  filteredData: TData[];
  sorting: SortingState;
  rows: Row<TData>[];
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
      id: columns[0]?.id || '',
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const columnFilters = useColumnFilters();

  const filteredData = useMemo(
    () => applyFilters<TData>(data || [], columnFilters.filters),
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

  const rows = useMemo(() => table.getRowModel()?.rows, [
    table,
    globalFilter,
    columnFilters.filters,
    data,
    sorting,
    table.getState().pagination,
  ]);

  const contextValue: DataTableContextValue<TData> = {
    table,
    filtersDefinition,
    columnFilters,
    globalFilter,
    data,
    filteredData,
    sorting,
    rows,
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
  return context;
}
