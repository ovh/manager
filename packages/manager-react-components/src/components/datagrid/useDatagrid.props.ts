import { ReactNode, MutableRefObject } from 'react';
import { ColumnDef, ColumnSort } from '@tanstack/react-table';

export interface DatagridContextType<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  isContextError?: boolean;
  headerRefs: MutableRefObject<Record<string, HTMLTableCellElement>>;
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
}

export interface DatagridProviderProps<T = any> {
  children: ReactNode;
  data?: T[];
  columns?: ColumnDef<T>[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
}
