import { ReactNode } from 'react';
import { ColumnDef } from '@tanstack/react-table';

export interface DatagridContextType<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  setData: (data: T[]) => void;
  setColumns: (columns: ColumnDef<T>[]) => void;
  isContextError?: boolean;
}

export interface DatagridProviderProps<T = any> {
  children: ReactNode;
  initialData?: T[];
  initialColumns?: ColumnDef<T>[];
}
