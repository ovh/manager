import { RefObject } from 'react';
import { RowModel } from '@tanstack/react-table';

export type TableBodyProps<T> = {
  rowModel: RowModel<T>;
  tableContainerRef: RefObject<HTMLDivElement>;
};
