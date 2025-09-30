import { VirtualItem } from '@tanstack/react-virtual';

export type SubRowProps<T> = {
  maxRowHeight: number;
  offset: number;
  renderSubComponent?: any;
  row: any;
  subComponentHeight: number;
  virtualRow: VirtualItem;
};
