import { ColumnSort, HeaderGroup } from '@tanstack/react-table';

export type TableHeaderContentProps<T = unknown> = {
  contentAlignLeft?: boolean;
  headerGroups: HeaderGroup<T>[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  enableSorting?: boolean;
};
