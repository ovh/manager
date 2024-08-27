import { useState } from 'react';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { DEFAULT_PAGINATION } from './datagrid.contants';

export const useDataGrid = (defaultSorting: ColumnSort = undefined) => {
  const [pagination, setPagination] = useState<PaginationState>(
    DEFAULT_PAGINATION,
  );
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);
  return { pagination, setPagination, sorting, setSorting };
};
