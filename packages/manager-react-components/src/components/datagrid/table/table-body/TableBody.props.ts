import { RefObject } from 'react';
import { RowModel, Row } from '@tanstack/react-table';

export type TableBodyProps<T> = {
  rowModel: RowModel<T>;
  tableContainerRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  renderSubComponent?: (row: Row<T>) => JSX.Element;
  subComponentHeight?: number;
};
