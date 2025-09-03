import { RefObject, MutableRefObject } from 'react';
import { RowModel, Row, ExpandedState, Column } from '@tanstack/react-table';

export type TableBodyProps<T> = {
  autoScroll?: boolean;
  isLoading: boolean;
  maxRowHeight: number;
  pageSize?: number;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  rowModel: RowModel<T>;
  subComponentHeight?: number;
  tableContainerRef: RefObject<HTMLDivElement>;
  contentAlignLeft?: boolean;
  expanded?: ExpandedState;
  columns: Column<T>[];
};
