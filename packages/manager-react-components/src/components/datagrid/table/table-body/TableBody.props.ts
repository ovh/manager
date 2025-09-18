import { RefObject, MutableRefObject } from 'react';
import { RowModel, Row } from '@tanstack/react-table';

export type TableBodyProps<T> = {
  rowModel: RowModel<T>;
  tableContainerRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  subComponentHeight?: number;
  maxRowHeight: number;
  pageSize?: number;
  autoScroll?: boolean;
};
