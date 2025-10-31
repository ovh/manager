import { JSX, MutableRefObject, RefObject } from 'react';

import type { Column, ExpandedState, Row, RowModel } from '@tanstack/react-table';

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
