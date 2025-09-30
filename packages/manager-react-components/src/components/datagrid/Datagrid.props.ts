import { MutableRefObject, ReactNode, Dispatch, SetStateAction } from 'react';
import {
  ColumnDef,
  ColumnSort as TanstackColumnSort,
  Row,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  FilterComparator,
  FilterTypeCategories as DatagridColumnTypes,
} from '@ovh-ux/manager-core-api';
import { SortingState } from '@tanstack/react-table';
import { Option } from '../filters/filter-add.component';
import { FilterWithLabel } from '../filters/interface';

export interface RowSelectionProps<T> {
  /** when used, for each row if expression is false, the row is disabled */
  enableRowSelection?: (row: Row<T>) => boolean;
  /** This callback is called every time 1 or multiple rows are selected */
  onRowSelectionChange?: (selectedRows: T[]) => void;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export interface SearchProps {
  onSearch: (search: string) => void;
  placeholder?: string;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

export type ColumnFilterProps = {
  comparator: FilterComparator;
  key: string;
  label: string;
  value: string | string[];
};

export interface FilterProps {
  add: (filters: ColumnFilterProps) => void;
  filters: FilterWithLabel[];
  remove: (filter: FilterWithLabel) => void;
}

export type ColumnSort = TanstackColumnSort;

export type DatagridProps<T extends Record<string, unknown>> = {
  autoScroll?: boolean;
  columns: ManagerColumnDef<T>[];
  columnVisibility?: VisibilityState;
  containerHeight?: number;
  contentAlignLeft?: boolean;
  data: T[];
  enableColumnvisibility?: boolean;
  enableFilter?: boolean;
  enableSearch?: boolean;
  expandable?: boolean;
  filters?: FilterProps;
  hasNextPage?: boolean;
  isLoading?: boolean;
  manualSorting?: boolean;
  maxRowHeight?: number;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  onSortChange?: (sorting: SortingState) => void;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  resourceType?: string;
  rowSelection?: RowSelectionProps<T>;
  search?: SearchProps;
  setColumnVisibility?: (columnVisibility: VisibilityState) => void;
  sorting?: SortingState;
  subComponentHeight?: number;
  topbar?: ReactNode;
  totalCount?: number;
};

export enum ColumnMetaType {
  TEXT = 'text',
  LINK = 'link',
  BADGE = 'badge',
}

export type ManagerColumnDef<T> = ColumnDef<T> & {
  /** set column comparator for the filter */
  comparator?: FilterComparator[];
  /** Allows the column to be hidden or shown dynamically */
  enableHiding?: boolean;
  /** filterOptions can be passed to have selector instead of input to choose value */
  filterOptions?: Option[];
  /** Trigger the column filter */
  isFilterable?: boolean;
  /** Trigger the column search */
  isSearchable?: boolean;
  /** label displayed for the column in the table */
  label?: string;
  meta?: {
    type?: ColumnMetaType;
    className?: string;
  };
  /** Filters displayed for the column */
  type?: DatagridColumnTypes;
};

/** It is use by different hooks to define the columns of the datagrid
 *  It Should be updated in the next ticket
 *  To delete after refatoring useDatagridTopbar
 */
export interface DatagridColumn<T> {
  /** formatter function to render a column cell */
  cell: (props: T) => JSX.Element;
  /** set column comparator for the filter */
  comparator?: FilterComparator[];
  /** Allows the column to be hidden or shown dynamically */
  enableHiding?: boolean;
  /** filterOptions can be passed to have selector instead of input to choose value */
  filterOptions?: Option[];
  /** unique column identifier */
  id: string;
  /** Trigger the column filter */
  isFilterable?: boolean;
  /** Trigger the column search */
  isSearchable?: boolean;
  /** is the column sortable ? (defaults is true) */
  isSortable?: boolean;
  /** label displayed for the column in the table */
  label: string;
  /** Set default column size */
  size?: number;
  /** Filters displayed for the column */
  type?: DatagridColumnTypes;
}
