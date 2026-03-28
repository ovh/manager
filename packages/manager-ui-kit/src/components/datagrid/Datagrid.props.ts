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

import { TABLE_SIZE, TABLE_VARIANT } from '@ovhcloud/ods-react';

import {
  FilterTypeCategories as DatagridColumnTypes,
  FilterComparator,
} from '@ovh-ux/manager-core-api';

import type { FilterOption, FilterProps } from '@/components/filters/Filter.props';

export interface RowSelectionProps<T> {
  enableRowSelection?: (row: Row<T>) => boolean;
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
  searchParams?: string;
}

export type ColumnSort = TanstackColumnSort;

export interface ExpandedProps<T> {
  expanded: ExpandedState;
  setExpanded: Dispatch<SetStateAction<ExpandedState>>;
  getRowCanExpand?: (row: Row<T>) => boolean;
}

export interface ExpandableRow<T> {
  id?: string;
  subRows?: T[];
}

export type DatagridProps<T extends ExpandableRow<T>> = {
  autoScroll?: boolean;
  columns: readonly DatagridColumn<T>[];
  columnVisibility?: ColumnVisibilityProps;
  containerHeight?: number;
  contentAlignLeft?: boolean;
  data: T[];
  expandable?: ExpandedProps<T>;
  filters?: FilterProps;
  hasNextPage?: boolean;
  hideHeader?: boolean;
  isLoading?: boolean;
  maxRowHeight?: number;
  resourceType?: string;
  rowSelection?: RowSelectionProps<T>;
  search?: SearchProps;
  sorting?: SortingProps;
  size?: TABLE_SIZE;
  subComponentHeight?: number;
  topbar?: ReactNode;
  totalCount?: number;
  variant?: TABLE_VARIANT;
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

export enum RowHeight {
  sm = 32.5,
  md = 49,
  lg = 64.5,
}

export enum ContainerHeight {
  sm = 375,
  md = 550,
  lg = 725,
}

export enum ContainerWihtoutHeaderHeight {
  sm = 340,
  md = 500,
  lg = 660,
}

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
