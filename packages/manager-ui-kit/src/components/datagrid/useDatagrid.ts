/**
 * useDataGrid will be removed in MUK V1
 * @deprecated use useDataApi instead
 */
import { useState } from 'react';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { DEFAULT_PAGINATION } from './datagrid.constants';

/**
 * useDataGrid will be removed in MUK V1
 * @deprecated use useDataApi instead
 */
export const useDataGrid = (defaultSorting: ColumnSort = undefined) => {
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const [sorting, setSorting] = useState<ColumnSort | undefined>(
    defaultSorting,
  );
  return { pagination, setPagination, sorting, setSorting };
};
