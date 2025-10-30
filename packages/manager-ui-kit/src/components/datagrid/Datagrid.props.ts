import { Dispatch, JSX, MutableRefObject, ReactNode, SetStateAction } from 'react';

import type {
  ColumnDef,
  ExpandedState,
  Row,
  RowSelectionState,
  SortingState,
  ColumnSort as TanstackColumnSort,
  VisibilityState,
} from '@tanstack/react-table';

import {
  FilterTypeCategories as DatagridColumnTypes,
  FilterComparator,
} from '@ovh-ux/manager-core-api';

import type { FilterOption, FilterProps } from '@/components/filters/Filter.props';
import { ExpandableRow } from './useDatagrid.props';

export interface RowSelectionProps<T> {
  onRowSelectionChange?: (selectedRows: T[]) => void;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export interface SortingProps {
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  manualSorting?: boolean;
}

export interface ColumnVisibilityProps {
  columnVisibility: VisibilityState;
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
}

export interface SearchProps {
  onSearch: (search: string) => void;
  placeholder?: string;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

export type ColumnSort = TanstackColumnSort;

export interface ExpandedProps {
  expanded: ExpandedState;
  setExpanded: Dispatch<SetStateAction<ExpandedState>>;
}

export type DatagridProps<T extends ExpandableRow<T>> = {
  autoScroll?: boolean;
  columns: readonly DatagridColumn<T>[];
  columnVisibility?: ColumnVisibilityProps;
  containerHeight?: number;
  contentAlignLeft?: boolean;
  data: T[];
  expandable?: ExpandedProps;
  filters?: FilterProps;
  hasNextPage?: boolean;
  isLoading?: boolean;
  maxRowHeight?: number;
  resourceType?: string;
  rowSelection?: RowSelectionProps<T>;
  search?: SearchProps;
  sorting?: SortingProps;
  subComponentHeight?: number;
  topbar?: ReactNode;
  totalCount?: number;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
};

export enum ColumnMetaType {
  TEXT = 'text',
  LINK = 'link',
  BADGE = 'badge',
}

// export type ManagerColumnDef<T> = ColumnDef<T> & {
export type DatagridColumn<T> = ColumnDef<T> & {
  /** set column comparator for the filter */
  comparator?: FilterComparator[];
  /** Allows the column to be hidden or shown dynamically */
  enableHiding?: boolean;
  /** filterOptions can be passed to have selector instead of input to choose value */
  filterOptions?: FilterOption[];
  /** Trigger the column filter */
  isFilterable?: boolean;
  /** Trigger the column search */
  isSearchable?: boolean;
  /** Trigger the column sorting */
  isSortable?: boolean;
  /** label displayed for the column in the table */
  label?: string;
  meta?: {
    type?: ColumnMetaType;
    className?: string;
  };
  /** Filters displayed for the column */
  type?: DatagridColumnTypes;
};
