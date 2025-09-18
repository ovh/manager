import { MutableRefObject } from 'react';
import {
  ColumnDef,
  ColumnSort as TanstackColumnSort,
  Row,
} from '@tanstack/react-table';
import {
  FilterComparator,
  FilterTypeCategories as DatagridColumnTypes,
} from '@ovh-ux/manager-core-api';
import { Option } from '../filters/filter-add.component';

export type ColumnSort = TanstackColumnSort;

export type DatagridProps<T extends Record<string, unknown>> = {
  columns: ManagerColumnDef<T>[];
  data: T[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
  contentAlignLeft?: boolean;
  hasNextPage?: boolean;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  isLoading?: boolean;
  containerHeight?: string;
  totalCount?: number;

  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  subComponentHeight?: number;
};

export enum ColumnMetaType {
  TEXT = 'text',
  LINK = 'link',
  BADGE = 'badge',
}

export type ManagerColumnDef<T> = ColumnDef<T> & {
  meta?: {
    type?: ColumnMetaType;
    className?: string;
  };
};

/** It is use by different hooks to define the columns of the datagrid
 *  It Should be updated in the next ticket
 */
export interface DatagridColumn<T> {
  /** unique column identifier */
  id: string;
  /** formatter function to render a column cell */
  cell: (props: T) => JSX.Element;
  /** label displayed for the column in the table */
  label: string;
  /** is the column sortable ? (defaults is true) */
  isSortable?: boolean;
  /** set column comparator for the filter */
  comparator?: FilterComparator[];
  /** Filters displayed for the column */
  type?: DatagridColumnTypes;
  /** Trigger the column filter */
  isFilterable?: boolean;
  /** Trigger the column search */
  isSearchable?: boolean;
  /** Set default column size */
  size?: number;
  /** filterOptions can be passed to have selector instead of input to choose value */
  filterOptions?: Option[];
  /** Allows the column to be hidden or shown dynamically */
  enableHiding?: boolean;
}
