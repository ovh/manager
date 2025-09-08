import { HeaderGroup, Column } from '@tanstack/react-table';

export type TableHeaderContentProps<T> = {
  headerGroups: HeaderGroup<T>[];
  contentAlignLeft?: boolean;
};
