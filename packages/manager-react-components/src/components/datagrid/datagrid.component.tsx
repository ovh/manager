import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
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
  VisibilityState,
  RowSelectionState,
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
import { defaultNumberOfLoadingRows } from './datagrid.constants';
import { DatagridTopbar } from './datagrid-topbar.component';
import './translations';
import { IndeterminateCheckbox } from './indeterminate-checkbox';

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

export interface RowSelectionProps<T> {
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  /** This callback is called every time 1 or multiple rows are selected */
  onRowSelectionChange?: (selectedRows: T[]) => void;
  /** when used, for each row if expression is false, the row is disabled */
  enableRowSelection?: (row: Row<T>) => boolean;
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
  setColumnVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
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
  /** To use if tag column is present and filter is enabled. This allows to fetch all tags from iam only for this resource type */
  resourceType?: string;
  /** Enable and configure row selection */
  rowSelection?: RowSelectionProps<T>;
  /** Use to overwrite row id */
  getRowId?: (originalRow: T, index: number) => string;
}

export const Datagrid = <T,>({
  columns,
  columnVisibility,
  setColumnVisibility,
  items,
  filters,
  search,
  topbar,
  totalItems,
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
  resourceType,
  rowSelection,
  getRowId,
}: DatagridProps<T>) => {
  const { t } = useTranslation('datagrid');
  const pageCount = pagination
    ? Math.ceil(totalItems / pagination.pageSize)
    : 1;

  const columnVisibilityState = useMemo<VisibilityState>(() => {
    if (columnVisibility) {
      return columns.reduce((acc, col) => {
        acc[col.id] = columnVisibility.includes(col.id);
        return acc;
      }, {} as VisibilityState);
    }
    return undefined;
  }, [columnVisibility?.join(','), JSON.stringify(columns)]);

  const onColumnVisibilityChange = useCallback((getToggledColumn) => {
    // Toggling one column
    if (typeof getToggledColumn === 'function') {
      const colName = Object.keys(getToggledColumn())?.[0];
      setColumnVisibility?.((prev) =>
        prev.includes(colName)
          ? prev.filter((c) => c !== colName)
          : [...prev, colName],
      );
    }
    // Toggling all columns
    else if (typeof getToggledColumn === 'object') {
      const newVisibility = Object.entries(getToggledColumn)
        .filter(([_, isVisible]) => isVisible)
        .map(([colName, _]) => colName);
      setColumnVisibility?.(newVisibility);
    }
  }, []);

  const headerRefs = useRef({});

  const table = useReactTable({
    columns: [
      ...(rowSelection
        ? [
            {
              id: 'select',
              cell: ({ row }: { row: Row<T> }) => (
                <IndeterminateCheckbox
                  id={row.id}
                  name={`select-${row.id}`}
                  label="select"
                  onChange={() => row.toggleSelected()}
                  isChecked={row.getIsSelected()}
                  isDisabled={!row.getCanSelect()}
                />
              ),
              header: () => (
                <IndeterminateCheckbox
                  id="select-all"
                  name="select-all"
                  label="select"
                  onChange={() => {
                    table.toggleAllRowsSelected();
                  }}
                  isChecked={table.getIsAllRowsSelected()}
                  isIndeterminate={table.getIsSomeRowsSelected()}
                />
              ),
            },
          ]
        : []),
      ...(getRowCanExpand && renderSubComponent
        ? [
            {
              id: 'expander',
              enableHiding: false,
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
          id: col.id,
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
        ...(rowSelection?.rowSelection && {
          rowSelection: rowSelection.rowSelection,
        }),
        ...(setColumnVisibility && {
          columnVisibility: columnVisibilityState,
        }),
      },
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(manualSorting && {
      state: {
        ...(sorting && {
          sorting: [sorting],
        }),
        ...(rowSelection?.rowSelection && {
          rowSelection: rowSelection.rowSelection,
        }),
        ...(setColumnVisibility && {
          columnVisibility: columnVisibilityState,
        }),
      },
      onStateChange: (updater) => {
        if (typeof updater === 'function') {
          const state = updater({ ...table.getState(), ...sorting });
          onSortChange?.(state.sorting[0]);
        } else if (onSortChange) {
          onSortChange(updater.sorting[0]);
        }
      },
    }),
    initialState: {
      ...(!setColumnVisibility &&
        columnVisibility && {
          columnVisibility: columnVisibilityState,
        }),
    },
    ...(setColumnVisibility && { onColumnVisibilityChange }),
    enableRowSelection: (row) => {
      if (rowSelection?.enableRowSelection)
        return rowSelection.enableRowSelection(row);

      return !!rowSelection;
    },
    onRowSelectionChange: rowSelection?.setRowSelection,
    getRowId,
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
          ...(column?.type && {
            comparators: FilterCategories[column.type],
            type: column.type,
          }),
          ...(column?.comparator && { comparators: column.comparator }),
          ...(column?.filterOptions && { options: column.filterOptions }),
        })),
    [columns],
  );

  const columnsVisibility = useMemo(
    () =>
      table.getAllLeafColumns().map((column) => {
        const col = columns.find(
          (item) => column.id === item.id.replaceAll('.', '_'),
        );
        return {
          id: column.id,
          label: col?.label,
          isVisible: () => column.getIsVisible(),
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

  // Handle onRowSelectionChange callback
  useEffect(() => {
    const selectedRows =
      table.getSelectedRowModel()?.rows?.map(({ original }) => original) || [];
    rowSelection?.onRowSelectionChange?.(selectedRows);
  }, [JSON.stringify(rowSelection?.rowSelection)]);

  /**
   * Update internal rowSelection state when items list change:
   * if items selected but is remove from list, remove it from row selection state
   */
  useEffect(() => {
    if (table.getSelectedRowModel()?.rows) {
      const newSelectionState = table
        .getSelectedRowModel()
        .rows.reduce((selection, { id }) => {
          return {
            ...selection,
            [id]: true,
          };
        }, {});
      table.setRowSelection(newSelectionState);
    }
  }, [JSON.stringify(items)]);

  return (
    <div>
      <DatagridTopbar
        columnsVisibility={columnsVisibility}
        toggleAllColumnsVisible={table.toggleAllColumnsVisible}
        getIsAllColumnsVisible={table.getIsAllColumnsVisible}
        getIsSomeColumnsVisible={table.getIsSomeColumnsVisible}
        filtersColumns={filtersColumns}
        isSearchable={!!searchColumns}
        filters={filters}
        search={search}
        topbar={topbar}
        resourceType={resourceType}
      />
      <div className={`contents px-[1px] ${className || ''}`}>
        <OdsTable className="overflow-x-visible">
          <table
            className="w-full border-collapse"
            style={
              { '--expander-column-width': '2.5rem' } as React.CSSProperties
            }
          >
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
                        } h-11 whitespace-nowrap ${
                          onSortChange && header.column.getCanSort()
                            ? 'cursor-pointer'
                            : ''
                        }`}
                        {...{
                          ...(onSortChange && {
                            onClick: header.column.getToggleSortingHandler(),
                          }),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className="flex items-center select-none"
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
                            <span className="inline-block ml-2 text-xs">
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
                  <td
                    className="text-center"
                    colSpan={columns.length + (!renderSubComponent ? 0 : 1)}
                  >
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
              onClick={onFetchAllPages}
              isLoading={isLoading}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
