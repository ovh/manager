import { ReactNode, MutableRefObject } from 'react';
import { Column, ColumnDef } from '@tanstack/react-table';

export interface DatagridContextType<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  isContextError?: boolean;
  headerRefs: MutableRefObject<Record<string, HTMLTableCellElement>>;
  onSortChange?: (column: Column<T>) => void;
}

export interface DatagridProviderProps<T = any> {
  children: ReactNode;
  data?: T[];
  columns?: ColumnDef<T>[];
  onSortChange?: (column: Column<T>) => void;
}
