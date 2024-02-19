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
}

export const PaginatedDatagrid = <T extends unknown>({
  columns,
  items,
  totalItems,
  pagination,
  sorting,
  onPaginationChange,
  onSortChange,
}: DatagridProps<T>) => {
  const { t } = useTranslation('paginated-datagrid');
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
      <table className="w-full mb-2">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-center h-11">
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
                      {header.column.getIsSorted() && (
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
                            name={
                              (header.column.getIsSorted() as string) === 'asc'
                                ? ODS_ICON_NAME.SORT_UP
                                : ODS_ICON_NAME.SORT_DOWN
                            }
                          />
                        </span>
                      )}
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
              className="text-center border-b-0"
              style={{
                border: '1px solid var(--ods-color-blue-200)',
                height: '3.25rem',
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  <>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </>
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr
              style={{
                border: '1px solid var(--ods-color-blue-200)',
                height: '3.25rem',
              }}
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
      {pagination && (
        <OsdsPagination
          current={pagination.pageIndex + 1}
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
