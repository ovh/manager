import React, { useMemo } from 'react';
import {
  ColumnDef,
  Column,
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFilter,
} from '@tanstack/react-table';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsTable,
  OsdsButton,
  OsdsIcon,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from './text-cell.component';
import './translations';
import FiltersCascading from './Filters';
import { string } from 'prop-types';

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
  sorting?: any;
  /** callback to handle pagination change events (optional if no pagination is required) */
  onPaginationChange?: (pagination: PaginationState) => void;
  /** callback to handle column sorting change events (optional if column sorting is not required) */
  onSortChange?: any;
  /** option to add custom CSS class */
  className?: string;

  hasNextPage?: boolean;
  fetchNextPage?: any;
  manualSorting?: boolean;
  manualPagination?: boolean;
  setSorting?: any;
}

// Extend the ColumnFilter type to include a custom condition
interface CustomColumnFilter extends ColumnFilter {
  condition?: string; // Add your custom condition attribute
}

export const Datagrid = <T extends unknown>({
  columns,
  items,
  sorting,
  className,
  onSortChange,
  hasNextPage,
  fetchNextPage,
  setSorting,
  manualSorting = true,
  manualPagination = true,
}: DatagridProps<T>) => {
  const { t } = useTranslation('datagrid');
  const [columnFilters, setColumnFilters] = React.useState<
    CustomColumnFilter[]
  >([]);
  const groupById = useMemo(() => {
    return columnFilters.reduce((result: any, currentValue: any) => {
      const groupKey = currentValue.id;
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  }, [columnFilters]);

  const customFilterFunction = (rows: any, columnIds: string[]) => {
    // @ts-ignore
    const results = groupById[columnIds];
    const stringToTest = rows?.getValue(columnIds);
    const testTabs = results.map((element: any) => {
      switch (element.condition) {
        case 'INCLUDES':
          return stringToTest.includes(element.value);
        case 'DOESNT_INCLUDE':
          return !stringToTest.includes(element.value);
        case 'NB_EQUALS_TO':
          return parseInt(stringToTest, 10) === parseInt(element.value, 10);
        case 'SMALLER_THAN':
          return parseInt(stringToTest, 10) < parseInt(element.value, 10);
        case 'BIGGER_THAN':
          return parseInt(stringToTest, 10) > parseInt(element.value, 10);
        case 'EQUALS_TO':
          return stringToTest === element.value;
        case 'DATE_IS':
          return stringToTest === element.value;
        case 'DIFFERENT_FROM':
          return stringToTest !== element.value;
        case 'START_WITH':
          return stringToTest.startsWith(element.value);
        case 'ENDS_WITH':
          return stringToTest.endsWith(element.value);
        default:
          return false;
      }
    });
    return testTabs.includes(false) ? false : true;
  };

  const table = useReactTable({
    columns: columns.map(
      (col): ColumnDef<T> => ({
        accessorKey: col.id,
        cell: (props) => col.cell(props.row.original),
        header: col.label,
        enableSorting: col.isSortable !== false,
        // filterFn: 'equalsString',
        // @ts-ignore
        filterFn: 'customFilter',
        // @ts-ignore
      }),
    ),
    data: items,
    manualPagination,
    manualSorting,
    enableSortingRemoval: true,
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    ...(!manualSorting && {
      onSortingChange: setSorting,
      state: {
        sorting,
        columnFilters,
      },
      getSortedRowModel: getSortedRowModel(),
    }),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      // @ts-ignore
      customFilter: customFilterFunction,
    },

    ...(manualSorting && {
      state: {
        ...(sorting && {
          sorting: [sorting],
        }),
        columnFilters,
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

  return (
    <div>
      {columns?.length > 0 && (
        <div className="p-4 text-right">
          <div>
            <FiltersCascading table={table} columns={columns} />
          </div>
        </div>
      )}
      <div className={`contents overflow-x-auto px-[1px] ${className || ''}`}>
        <OsdsTable>
          <table className="w-full border-collapse">
            <thead>
              {table?.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-center h-11 whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            onSortChange && header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
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
                                (header.column.getIsSorted() as string) ===
                                'asc'
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
              {table?.getRowModel()?.rows?.map((row) => (
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
        </OsdsTable>
      </div>
      {hasNextPage && (
        <div className="grid justify-items-center my-5">
          <OsdsButton
            color={ODS_THEME_COLOR_INTENT.info}
            variant={ODS_BUTTON_VARIANT.stroked}
            onClick={fetchNextPage}
          >
            Load more
          </OsdsButton>
        </div>
      )}
      <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2,
        )}
      </pre>
    </div>
  );
};
