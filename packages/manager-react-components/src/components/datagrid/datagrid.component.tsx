import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Row,
  OnChangeFn,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ODS_ICON_NAME,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsIcon,
  OdsPagination,
  OdsSkeleton,
  OdsTable,
} from '@ovhcloud/ods-components/react';

import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories as DatagridColumnTypes,
} from '@ovh-ux/manager-core-api';
import { clsx } from 'clsx';
import { Option, ColumnFilter } from '../filters/filter-add.component';
import { FilterWithLabel } from '../filters/interface';
import { DataGridTextCell } from './text-cell.component';
import { defaultNumberOfLoadingRows } from './datagrid.contants';
import { DatagridTopbar } from './datagrid-topbar.component';
import DatagridVirtualized from './datagrid-virtualized.component';
import DatagridHeader from './datagrid-header.component';
import './translations';

export type ColumnSort = TanstackColumnSort;
export type PaginationState = TanstackPaginationState;
export { FilterTypeCategories as DatagridColumnTypes } from '@ovh-ux/manager-core-api';
// Note: current prettier version does not supports export type
// we could replace those types with :
// export type { ColumnSort } from '@tanstack/react-table';
// export type { PaginationState } from '@tanstack/react-table';

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

type ColumnFilterProps = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  label: string;
};

export interface FilterProps {
  filters: FilterWithLabel[];
  add: (filters: ColumnFilterProps) => void;
  remove: (filter: FilterWithLabel) => void;
}

export interface SearchProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (search: string) => void;
}

export interface DatagridProps<T> {
  /** list of datagrid columns */
  columns: DatagridColumn<T>[];
  /** list of items (rows) to display in the table */
  items: T[];
  /** total number of items (in case of pagination) */
  totalItems: number;
  /** state of pagination (optional if no pagination is required) */
  pagination?: PaginationState;
  /** state of column sorting (optional if column sorting is not required) */
  sorting?: ColumnSort;
  /** callback to handle pagination change events (optional if no pagination is required) */
  onPaginationChange?: (pagination: PaginationState) => void;
  /** callback to handle column sorting change events (optional if column sorting is not required) */
  onSortChange?: any;
  /** option to add custom CSS class */
  className?: string;
  /** option to adjust content on the left */
  contentAlignLeft?: boolean;
  /** boolean to display load more button, and load all button if onFetchAllPages is defined */
  hasNextPage?: boolean;
  /** callback on load more button click */
  onFetchNextPage?: any;
  /** callback on load all button click, the button will be displayed only if this function is defined and hasNextPage is true */
  onFetchAllPages?: React.MouseEventHandler<HTMLOdsButtonElement>;
  /** Enables manual sorting for the table */
  manualSorting?: boolean;
  /** Enables manual pagination */
  manualPagination?: boolean;
  /** If provided, this function will be called with an updaterFn when state.sorting changes. */
  /** setSorting?: OnChangeFn<SortingState>; */
  /** label displayed if there is no item in the datagrid */
  noResultLabel?: string;
  /** whether or not the table is in loading state */
  isLoading?: boolean;
  /** number of loading rows to show when table is in loading state, defaults to pagination.pageSize or 5 */
  numberOfLoadingRows?: number;
  /** List of filters and handlers to add, remove */
  filters?: FilterProps;
  /** Trigger the column search. In case of backend search, make sure to add this on columns on which API supports the search option. */
  search?: SearchProps;
  /** ids of the columns visible in the datagrid (optional by default all columns are visible) */
  columnVisibility?: string[];
  /** callback to handle column visibility change events (optional) */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  /** Add react element at left in the datagrid topbar */
  topbar?: React.ReactNode;
  /** Function to render sub component as row child */
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: React.MutableRefObject<Record<string, HTMLTableCellElement>>,
  ) => JSX.Element;
  /** function to define if row can be expanded or not */
  getRowCanExpand?: (row: Row<T>) => boolean;
  /** Hide datagrid header if true */
  hideHeader?: boolean;
  /** Resets the expanded rows when data is updated */
  resetExpandedRowsOnItemsChange?: boolean;
  /** When true, will fix the columns size by column definition size */
  tableLayoutFixed?: boolean;
  isFetchAll?: boolean;
}

export const Datagrid = <T,>({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  items,
  filters,
  search,
  topbar,
  totalItems,
  isFetchAll,
  pagination,
  sorting,
  className,
  onPaginationChange,
  onSortChange,
  contentAlignLeft = true,
  hasNextPage,
  onFetchNextPage,
  onFetchAllPages,
  manualSorting = true,
  manualPagination = true,
  noResultLabel,
  isLoading = false,
  numberOfLoadingRows,
  renderSubComponent,
  getRowCanExpand,
  resetExpandedRowsOnItemsChange,
  hideHeader,
  tableLayoutFixed,
}: DatagridProps<T>) => {
  const { t } = useTranslation('datagrid');
  const pageCount = pagination
    ? Math.ceil(totalItems / pagination.pageSize)
    : 1;

  const headerRefs = useRef({});

  console.info('Items : ', items);

  const table = useReactTable({
    columns: [
      ...(getRowCanExpand && renderSubComponent
        ? [
            {
              id: 'expander',
              cell: ({ row }: { row: Row<T> }) => {
                return row.getCanExpand() ? (
                  <OdsButton
                    label=""
                    onClick={row.getToggleExpandedHandler()}
                    icon={
                      row.getIsExpanded()
                        ? ODS_ICON_NAME.chevronDown
                        : ODS_ICON_NAME.chevronRight
                    }
                    variant={ODS_BUTTON_VARIANT.ghost}
                    size={ODS_BUTTON_SIZE.xs}
                  />
                ) : null;
              },
            },
          ]
        : []),
      ...columns.map(
        (col): ColumnDef<T> => ({
          accessorKey: col.id,
          cell: (props) => col.cell(props.row.original),
          header: col.label,
          enableSorting: col.isSortable !== false,
          size: col.size,
          enableHiding: col.enableHiding !== false,
        }),
      ),
    ],
    data: items,
    manualPagination,
    manualSorting,
    enableSortingRemoval: false,
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand,
    pageCount,
    ...(!manualSorting && {
      onSortingChange: onSortChange,
      state: {
        sorting,
      },
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(manualSorting && {
      state: {
        ...(sorting && {
          sorting: [sorting],
        }),
      },
      onStateChange: (updater) => {
        if (typeof updater === 'function') {
          const state = updater({ ...table.getState(), ...sorting });
          if (onSortChange) onSortChange(state.sorting[0]);
        } else if (onSortChange) {
          onSortChange(updater.sorting[0]);
        }
      },
    }),
    initialState: {
      columnVisibility: columns.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: columnVisibility?.includes(id),
        }),
        {},
      ),
    },
    ...(onColumnVisibilityChange && { onColumnVisibilityChange }),
  });

  useEffect(() => {
    if (resetExpandedRowsOnItemsChange) {
      table.resetExpanded();
    }
  }, [items, resetExpandedRowsOnItemsChange]);

  const filtersColumns = useMemo<ColumnFilter[]>(
    () =>
      columns
        ?.filter(
          (item) =>
            ('comparator' in item || 'type' in item) &&
            'isFilterable' in item &&
            item.isFilterable,
        )
        .map((column) => ({
          id: column.id,
          label: column.label,
          ...(column?.type && { comparators: FilterCategories[column.type] }),
          ...(column?.comparator && { comparators: column.comparator }),
          ...(column?.filterOptions && { options: column.filterOptions }),
        })),
    [columns],
  );

  const columnsVisibility = useMemo(
    () =>
      table.getAllLeafColumns().map((column) => {
        const col = columns.find((item) => column.id === item.id);
        return {
          id: column.id,
          label: column.columnDef.header as string,
          isVisible: () => column.getIsVisible(),
          isVisibleByDefault: columnVisibility?.includes(column.id),
          isDisabled: !column.getCanHide(),
          enableHiding: col?.enableHiding,
          onChange: () => column.toggleVisibility(!column.getIsVisible()),
        };
      }),
    [columns],
  );

  const searchColumns = useMemo(
    () => columns?.find((item) => item?.isSearchable),
    [columns],
  );

  console.info('isFetchAll : ', isFetchAll);
  if (isFetchAll) {
    console.info('CONDITION 2');
    return (
      <>
        <div>virtualized</div>
        <DatagridVirtualized
          table={table}
          contentAlignLeft={contentAlignLeft}
          onSortChange={onSortChange}
        />
      </>
    );
  }

  return (
    <div>
      {/* voir pour decouper le datagrid topbar */}
      <DatagridTopbar
        columnsVisibility={columnsVisibility}
        filtersColumns={filtersColumns}
        isSearchable={!!searchColumns}
        filters={filters}
        search={search}
        topbar={topbar}
      />
      <div className={`contents px-[1px] ${className || ''}`}>
        <OdsTable className="overflow-x-visible">
          <table
            className="w-full border-collapse"
            style={
              { '--expander-column-width': '2.5rem' } as React.CSSProperties
            }
          >
            {/* voir pour decouper le datagrid header */}
            {!hideHeader && (
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        ref={(el) => {
                          headerRefs.current[header.id] = el;
                        }}
                        className={`${
                          contentAlignLeft ? 'text-left pl-4' : 'text-center'
                        } h-11 whitespace-nowrap `}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className:
                                onSortChange && header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : '',
                              ...(onSortChange && {
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }),
                            }}
                            data-testid={`header-${header.id}`}
                          >
                            <span>
                              <>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </>
                            </span>
                            <span
                              className={`align-middle inline-block h-4 -mt-6`}
                            >
                              <OdsIcon
                                className={
                                  header.column.getIsSorted() ? '' : 'invisible'
                                }
                                name={
                                  (header.column.getIsSorted() as string) ===
                                  'asc'
                                    ? ODS_ICON_NAME.arrowUp
                                    : ODS_ICON_NAME.arrowDown
                                }
                              />
                            </span>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-solid border-[1px] h-[3.25rem] border-[--ods-color-blue-200]">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={clsx(
                          contentAlignLeft ? 'text-left pl-4' : 'text-center',
                          {
                            'w-[2.5rem]': cell.id.indexOf('expander') !== -1,
                          },
                        )}
                        style={{
                          width: tableLayoutFixed
                            ? `${cell.column.getSize()}px`
                            : null,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && !!renderSubComponent && (
                    <tr className="sub-row">
                      {/* 2nd row is a custom 1 cell row */}
                      <td colSpan={row.getVisibleCells().length}>
                        {renderSubComponent(row, headerRefs)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {table.getRowModel().rows.length === 0 && !isLoading && (
                <tr
                  className={
                    'border-solid border-[1px] h-[3.25rem] border-[--ods-color-blue-200]'
                  }
                >
                  <td className="text-center" colSpan={columns.length}>
                    <DataGridTextCell>
                      {noResultLabel ?? t('common_pagination_no_results')}
                    </DataGridTextCell>
                  </td>
                </tr>
              )}
              {isLoading &&
                Array.from({
                  length:
                    numberOfLoadingRows ||
                    pagination?.pageSize ||
                    defaultNumberOfLoadingRows,
                }).map((_, idx) => (
                  <tr
                    key={`loading-row-${idx})`}
                    className="h-[3.25rem]"
                    data-testid="loading-row"
                  >
                    {table.getAllColumns().map((col) =>
                      col.getIsVisible() ? (
                        <td key={`loading-cell-${idx}-${col.id}`}>
                          <OdsSkeleton />
                        </td>
                      ) : null,
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </OdsTable>
      </div>
      {/* voir pour decouper le datagrid bottombar */}
      {!onFetchNextPage && items?.length > 0 && pagination ? (
        <OdsPagination
          defaultCurrentPage={pagination.pageIndex + 1}
          className="flex xs:justify-start md:justify-end my-8"
          total-items={totalItems}
          total-pages={pageCount}
          default-items-per-page={pagination.pageSize}
          onOdsChange={({ detail }) => {
            if (detail.current !== detail.oldCurrent) {
              onPaginationChange({
                ...pagination,
                pageIndex: detail.current - 1,
                pageSize: detail.itemPerPage,
              });
            }
          }}
          onOdsItemPerPageChange={({ detail }) => {
            if (detail.current !== pagination.pageSize)
              onPaginationChange({
                ...pagination,
                pageSize: detail.current,
                pageIndex: 0,
              });
          }}
        >
          <span slot="before-total-items" className="mr-3">
            {t('common_pagination_of')}
          </span>
          <span slot="after-total-items" className="ml-3">
            {t('common_pagination_results')}
          </span>
        </OdsPagination>
      ) : (
        <></>
      )}
      {/* voir pour decouper le datagrid bottombar */}
      {hasNextPage ? (
        <div className="flex justify-center gap-5 my-5">
          <OdsButton
            data-testid="load-more-btn"
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('common_pagination_load_more')}
            onClick={onFetchNextPage}
            isLoading={isLoading}
          />
          {onFetchAllPages && (
            <OdsButton
              data-testid="load-all-btn"
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('common_pagination_load_all')}
              onClick={(event) => {
                onFetchAllPages(event);
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
