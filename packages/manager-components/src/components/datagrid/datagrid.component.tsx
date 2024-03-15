import React from 'react';
import {
  ColumnDef,
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsIcon,
  OsdsPagination,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
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
  cell: (props: T) => JSX.Element;
  /** label displayed for the column in the table */
  label: string;
  /** is the column sortable ? (defaults is true) */
  isSortable?: boolean;
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
  onSortChange?: (sorting: ColumnSort) => void;
  /** option to add custom CSS class */
  className?: string;
}

export const Datagrid = <T extends unknown>({
  columns,
  items,
  totalItems,
  pagination,
  sorting,
  className,
  onPaginationChange,
  onSortChange,
}: DatagridProps<T>) => {
  const { t } = useTranslation('datagrid');
  const pageCount = pagination
    ? Math.ceil(totalItems / pagination.pageSize)
    : 1;

  const table = useReactTable({
    columns: columns.map(
      (col): ColumnDef<T> => ({
        accessorKey: col.id,
        cell: (props) => col.cell(props.row.original),
        header: col.label,
        enableSorting: col.isSortable !== false,
      }),
    ),
    data: items,
    manualPagination: true,
    pageCount,
    state: {
      pagination: { ...pagination },
      ...(sorting && {
        sorting: [sorting],
      }),
    },
    enableSortingRemoval: false,
    manualSorting: true,
    sortDescFirst: false,
    onStateChange: (updater) => {
      if (typeof updater === 'function') {
        const state = updater({ ...table.getState(), ...sorting });
        if (onSortChange) onSortChange(state.sorting[0]);
      } else if (onSortChange) {
        onSortChange(updater.sorting[0]);
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className={`contents overflow-x-auto px-[1px] ${className || ''}`}>
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-center h-11 whitespace-nowrap"
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
                        <OsdsText
                          size={ODS_TEXT_SIZE._500}
                          color={ODS_THEME_COLOR_INTENT.text}
                          level={ODS_TEXT_LEVEL.body}
                          hue={ODS_THEME_COLOR_HUE._500}
                        >
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </>
                        </OsdsText>
                        <span
                          className={`align-middle inline-block h-4 ${
                            (header.column.getIsSorted() as string) === 'asc'
                              ? '-mt-5'
                              : '-mt-9'
                          }`}
                        >
                          <OsdsIcon
                            size={ODS_ICON_SIZE.sm}
                            color={ODS_THEME_COLOR_INTENT.primary}
                            className={
                              header.column.getIsSorted() ? '' : 'invisible'
                            }
                            name={
                              (header.column.getIsSorted() as string) === 'asc'
                                ? ODS_ICON_NAME.SORT_UP
                                : ODS_ICON_NAME.SORT_DOWN
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
                className="text-center border-solid border-[1px] h-[3.25rem] border-[var(--ods-color-blue-200)]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    <>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </>
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr
                className={
                  'border-solid border-[1px] h-[3.25rem] border-[var(--ods-color-blue-200)]'
                }
              >
                <td className="text-center" colSpan={columns.length}>
                  <DataGridTextCell>
                    {t('common_pagination_no_results')}
                  </DataGridTextCell>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <OsdsPagination
          current={pagination.pageIndex + 1}
          className={'flex xs:justify-center md:justify-end'}
          total-items={totalItems}
          total-pages={pageCount}
          default-items-per-page={pagination.pageSize}
          onOdsPaginationChanged={({ detail }) => {
            if (detail.current !== detail.oldCurrent) {
              onPaginationChange({
                ...pagination,
                pageIndex: detail.current - 1,
                pageSize: detail.itemPerPage,
              });
            }
          }}
          onOdsPaginationItemPerPageChanged={({ detail }) => {
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
        </OsdsPagination>
      )}
    </div>
  );
};
