import { useState } from 'react';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { DEFAULT_PAGINATION } from './datagrid.constants';

export const useDataGrid = (defaultSorting?: ColumnSort) => {
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const [sorting, setSorting] = useState<ColumnSort | undefined>(
    defaultSorting,
  );
  return { pagination, setPagination, sorting, setSorting };
};
