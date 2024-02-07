import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

import DataGridPagination from './pagination/Pagination';

type DataGridColumn<T> = {
  id: string;
  cell: (props: T) => JSX.Element;
  label: string;
};

type DataGridProps<T> = {
  columns: DataGridColumn<T>[];
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
  };
  pageSizes: number[];
  totalItems: number;
  pageCount: number;
  onPaginationChange: (pagination: { page: number; pageSize: number }) => void;

  sorting: ColumnSort[];
  onSortChange: (sorting: { id: string; desc: boolean }[]) => void;
};

export default function DataGrid<T>({
  columns,
  items,
  pagination,
  pageCount,
  pageSizes,
  totalItems,
  sorting,
  onPaginationChange,
  onSortChange,
}: DataGridProps<T>) {
  const table = useReactTable({
    columns: columns.map(
      (c): ColumnDef<T> => ({
        accessorKey: c.id,
        // eslint-disable-next-line react/prop-types
        cell: (props) => c.cell(props.row.original),
        header: c.label,
      }),
    ),
    data: items,

    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
      },
      sorting: [...sorting],
    },
    enableSortingRemoval: false,
    manualSorting: true,
    enableMultiSort: true,
    sortDescFirst: false,
    onStateChange: (updater) => {
      if (typeof updater === 'function') {
        const state = updater({ ...table.getState(), ...sorting });
        onSortChange(state.sorting);
      } else {
        onSortChange(updater.sorting);
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
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <OsdsText
                        size={ODS_TEXT_SIZE._500}
                        color={ODS_THEME_COLOR_INTENT.text}
                        level={ODS_TEXT_LEVEL.body}
                        hue={ODS_THEME_COLOR_HUE._500}
                        style={{
                          '--osds-text-color-specific-hue':
                            'var(--ods-color-text-500);',
                        }}
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
                          className="align-middle inline-block h-4"
                          style={{
                            marginTop:
                              (header.column.getIsSorted() as string) === 'asc'
                                ? '0'
                                : '-1.5rem',
                          }}
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
        <tbody style={{ borderBottom: '1px solid var(--ods-color-blue-200)' }}>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="text-center border-b-0"
              style={{
                border: '1px solid var(--ods-color-blue-200)',
                height: '52px',
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
        </tbody>
      </table>

      <DataGridPagination
        numPages={pageCount}
        currentPage={pagination.page}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPageChange={(page) => {
          if (page !== pagination.page)
            onPaginationChange({ ...pagination, page });
        }}
        numItems={totalItems}
        currentPageSize={pagination.pageSize}
        pageSizes={pageSizes}
        onPageSizeChange={(pageSize) => {
          if (pageSize !== pagination.pageSize)
            onPaginationChange({ ...pagination, pageSize, page: 0 });
        }}
      />
    </div>
  );
}
