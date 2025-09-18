import { ReactNode } from 'react';
import { Column, VisibilityState } from '@tanstack/react-table';

export type ColumnsVisibilityProps<T> = {
  topbar?: ReactNode;
  columnVisibility?: VisibilityState;
  visibleColumns?: Column<T, unknown>[];
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  toggleAllColumnsVisible?: () => void;
  getIsAllColumnsVisible?: () => boolean;
  getIsSomeColumnsVisible?: () => boolean;
};
