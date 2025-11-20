import { JSX, MutableRefObject } from 'react';

import type { ColumnDef, ColumnSort, Row, VisibilityState } from '@tanstack/react-table';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import {
  ExpandableRow,
  ExpandedProps,
  RowSelectionProps,
} from '@/components/datagrid/Datagrid.props';

export type TableBuilderProps<T extends ExpandableRow<T>> = {
  columns: readonly ColumnDef<T>[];
  columnVisibility: VisibilityState;
  data: T[];
  expandable: ExpandedProps<T>;
  hasExpandableFeature: boolean;
  hasSortingFeature: boolean;
  manualSorting: boolean;
  onSortChange: (sorting: ColumnSort[]) => void;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element | null;
  rowSelection?: RowSelectionProps<T> | null;
  setColumnVisibility: (columnVisibility: VisibilityState) => void;
  sorting: ColumnSort[];
  size: TABLE_SIZE;
};
