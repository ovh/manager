import { JSX, MutableRefObject } from 'react';

import type { Column, ExpandedState, Row, RowModel } from '@tanstack/react-table';

export type TableBodyProps<T> = {
  autoScroll?: boolean;
  isLoading: boolean;
  hideHeader?: boolean;
  maxRowHeight: number;
  pageSize?: number;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  rowModel: RowModel<T>;
  subComponentHeight?: number;
  tableContainerRef: HTMLDivElement | null;
  contentAlignLeft?: boolean;
  expanded?: ExpandedState;
  columns: Column<T>[];
};
