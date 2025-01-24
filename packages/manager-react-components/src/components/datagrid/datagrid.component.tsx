import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import {
  ODS_ICON_NAME,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsPopover,
  OdsButton,
  OdsIcon,
  OdsPagination,
  OdsTable,
} from '@ovhcloud/ods-components/react';
import {
  FilterComparator,
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { FilterAdd, FilterList } from '../filters';
import { FilterWithLabel } from '../filters/interface';
import { DataGridTextCell } from './text-cell.component';
import './translations';

export type ColumnSort = TanstackColumnSort;
export type PaginationState = TanstackPaginationState;
// Note: current prettier version does not supports export type
// we could replace those types with :
// export type { ColumnSort } from '@tanstack/react-table';
// export type { PaginationState } from '@tanstack/react-table';

export interface DatagridColumn<T> {
  /** unique column identifier */
  id: string;
  /** formatter function to render a column cell */
  // cell: (props: T) => JSX.Element;
  cell: any;
  /** label displayed for the column in the table */
  label: string;
  /** is the column sortable ? (defaults is true) */
  isSortable?: boolean;
  /** set column comparator for the filter */
  comparator?: FilterComparator;
  /** Filters displayed for the column */
  type?: FilterTypeCategories;
  /** Trigger the column filter */
  isFilterable?: boolean;
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
  /** boolean to display load more button */
  hasNextPage?: boolean;
  /** callback when click on load more button */
  onFetchNextPage?: any;
  /** Enables manual sorting for the table */
  manualSorting?: boolean;
  /** Enables manual pagination */
  manualPagination?: boolean;
  /** If provided, this function will be called with an updaterFn when state.sorting changes. */
  /** setSorting?: OnChangeFn<SortingState>; */
  /** label displayed if there is no item in the datagrid */
  noResultLabel?: string;
  /** List of filters and handlers to add, remove */
  filters?: FilterProps;
}

export const Datagrid = <T,>({
  columns,
  items,
  filters,
  totalItems,
  pagination,
  sorting,
  className,
  onPaginationChange,
  onSortChange,
  contentAlignLeft = true,
  hasNextPage,
  onFetchNextPage,
  manualSorting = true,
  manualPagination = true,
  noResultLabel,
}: DatagridProps<T>) => {
  const { t } = useTranslation('datagrid');
  const filterPopoverRef = useRef(null);
  const pageCount = pagination
    ? Math.ceil(totalItems / pagination.pageSize)
    : 1;

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  console.info('manualSorting ', manualSorting);
  const table = useReactTable({
    columns: columns.map(
      (col): ColumnDef<T> => ({
        accessorKey: col.id,
        // BREAKING CHANGE
        cell: (props) => col.cell(props),
        header: col.label,
        enableSorting: col.isSortable !== false,
      }),
    ),
    data: items,
    manualPagination,
    manualSorting,
    enableSortingRemoval: false,
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    pageCount,

    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,

    ...(!manualSorting && {
      onSortingChange: onSortChange,
      state: {
        sorting,
        expanded,
      },
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(manualSorting && {
      state: {
        ...(sorting && {
          sorting: [sorting],
        }),
        expanded,
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
  });

  const [columnsFilters, setColumnsFilters] = useState([]);
  useEffect(() => {
    const clmFilters = columns
      .filter(
        (item) =>
          ('comparator' in item || 'type' in item) &&
          'isFilterable' in item &&
          item['isFilterable'],
      )
      .map((column) => ({
        id: column.id,
        label: column.label,
        ...(column?.type && { comparators: FilterCategories[column.type] }),
        ...(column?.comparator && { comparators: column.comparator }),
      }));
    setColumnsFilters(clmFilters);
  }, [columns]);

  return (
    <div>
      {columnsFilters.length > 0 && (
        <div className="flex flex-row-reverse py-[24px]">
          <div id="datagrid-filter-popover-trigger">
            <OdsButton
              slot="datagrid-filter-popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.filter}
              label=""
            />
          </div>
          <OdsPopover
            ref={filterPopoverRef}
            triggerId="datagrid-filter-popover-trigger"
            with-arrow
          >
            <FilterAdd
              columns={columnsFilters}
              onAddFilter={(addedFilter, column) => {
                filters.add({
                  ...addedFilter,
                  label: column.label,
                });
                filterPopoverRef.current?.hide();
              }}
            />
          </OdsPopover>
        </div>
      )}
      {filters?.filters.length > 0 && (
        <div id="datagrid-filter-list" className="mb-[24px]">
          <FilterList
            filters={filters.filters}
            onRemoveFilter={filters.remove}
          />
        </div>
      )}

      <div className={`contents px-[1px] ${className || ''}`}>
        <OdsTable className="overflow-x-visible">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
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
                              onClick: header.column.getToggleSortingHandler(),
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
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-solid border-[1px] h-[3.25rem] border-[--ods-color-blue-200]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={
                        contentAlignLeft ? 'text-left pl-4' : 'text-center'
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
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
            </tbody>
          </table>
        </OdsTable>
      </div>
      {!onFetchNextPage && items?.length > 0 && pagination ? (
        <OdsPagination
          defaultCurrentPage={pagination.pageIndex + 1}
          className={'flex xs:justify-start md:justify-end'}
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
      {hasNextPage && (
        <div className="grid justify-items-center my-5">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('common_pagination_load_more')}
            onClick={onFetchNextPage}
          />
        </div>
      )}
    </div>
  );
};
