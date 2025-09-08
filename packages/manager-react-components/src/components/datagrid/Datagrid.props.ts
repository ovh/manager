import {
  Column,
  ColumnDef,
  ColumnSort as TanstackColumnSort,
} from '@tanstack/react-table';
import { Option } from '../filters/filter-add.component';
import {
  FilterComparator,
  FilterTypeCategories as DatagridColumnTypes,
} from '@ovh-ux/manager-core-api';

export type ColumnSort = TanstackColumnSort;

export type DatagridProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  sorting?: ColumnSort[];
  onSortChange?: (sorting: ColumnSort[]) => void;
  manualSorting?: boolean;
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
