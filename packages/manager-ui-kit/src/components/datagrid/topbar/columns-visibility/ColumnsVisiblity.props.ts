import { ReactNode } from 'react';
import { Column, VisibilityState } from '@tanstack/react-table';
import { DatagridColumn, FilterProps, SearchProps } from '../../Datagrid.props';

export type ColumnsVisibilityProps<T> = {
  columns?: readonly DatagridColumn<T>[];
  columnVisibility?: VisibilityState;
  enableColumnvisibility?: boolean;
  enableFilter?: boolean;
  enableSearch?: boolean;
  filters?: FilterProps;
  getIsAllColumnsVisible?: () => boolean;
  getIsSomeColumnsVisible?: () => boolean;
  resourceType?: string;
  search?: SearchProps;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  topbar?: ReactNode;
  toggleAllColumnsVisible?: () => void;
  visibleColumns?: Column<T, unknown>[];
};
