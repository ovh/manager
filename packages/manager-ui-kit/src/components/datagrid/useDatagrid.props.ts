import { MutableRefObject } from 'react';

import { ColumnSort, Row, VisibilityState } from '@tanstack/react-table';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { DatagridColumn, ExpandedProps, RowSelectionProps } from './Datagrid.props';

export type UseDatagridTableProps<T> = {
  columns: readonly DatagridColumn<T>[];
  columnVisibility?: VisibilityState;
  data: T[];
  expandable?: ExpandedProps;
  manualSorting?: boolean;
  onSortChange?: (sorting: ColumnSort[]) => void;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  rowSelection?: RowSelectionProps<T>;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  sorting?: ColumnSort[];
  sizeRow?: TABLE_SIZE;
};

export interface ExpandableRow<T> {
  subRows?: T[];
}
