import { ReactNode } from 'react';
import { Column, VisibilityState } from '@tanstack/react-table';
import {
  ManagerColumnDef,
  FilterProps,
  SearchProps,
} from '../../Datagrid.props';

export type ColumnsVisibilityProps<T> = {
  columns?: ManagerColumnDef<T>[];
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
