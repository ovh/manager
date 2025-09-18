import { VirtualItem } from '@tanstack/react-virtual';

export type SubRowProps<T> = {
  renderSubComponent?: any;
  subComponentHeight: number;
  virtualRow: VirtualItem;
  offset: number;
  row: any;
  maxRowHeight: number;
};
