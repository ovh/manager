import {
  Row,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import {
  Icon,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  ICON_NAME,
  Checkbox,
  CheckboxControl,
} from '@ovhcloud/ods-react';
import { UseDatagridTableProps, ExpandableRow } from './useDatagrid.props';
import { Button } from '../button';

export const useDatagrid = <T extends ExpandableRow<T>>({
  columns,
  columnVisibility,
  data,
  expandable,
  manualSorting,
  onSortChange,
  renderSubComponent,
  rowSelection,
  setColumnVisibility,
  sorting,
}: UseDatagridTableProps<T>) => {
  return useReactTable({
    columns: [
      ...(rowSelection
        ? [
            {
              id: 'select',
              maxSize: 50,
              enableResizing: true,
              enableHiding: true,
              cell: ({ row }: { row: Row<T> }) => (
                <Checkbox
                  id={row.id}
                  name={`select-${row.id}`}
                  onChange={() => row.toggleSelected()}
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                >
                  <CheckboxControl />
                </Checkbox>
              ),
              header: ({ table }) => (
                <Checkbox
                  id="select-all"
                  name="select-all"
                  onChange={() => {
                    table.toggleAllRowsSelected();
                  }}
                  checked={table.getIsAllRowsSelected()}
                >
                  <CheckboxControl />
                </Checkbox>
              ),
            },
          ]
        : []),
      ...(expandable || renderSubComponent
        ? [
            {
              id: 'expander',
              enableHiding: false,
              maxSize: 50,
              enableResizing: true,
              cell: ({ row }: { row: Row<T> }) => {
                return row.getCanExpand() ? (
                  <div
                    className="text-center"
                    style={{
                      ...(expandable && { paddingLeft: `${row.depth * 2}rem` }),
                    }}
                  >
                    {expandable && row.depth ? null : (
                      <Button
                        onClick={row.getToggleExpandedHandler()}
                        variant={BUTTON_VARIANT.ghost}
                        size={BUTTON_SIZE.xs}
                      >
                        <Icon
                          name={
                            row.getIsExpanded()
                              ? ICON_NAME.chevronDown
                              : ICON_NAME.chevronRight
                          }
                        />
                      </Button>
                    )}
                  </div>
                ) : null;
              },
            },
          ]
        : []),
      ...columns,
    ],
    data,
    getSubRows: (row) => row?.subRows,
    getCoreRowModel: getCoreRowModel(),
    ...((renderSubComponent || expandable) && {
      getRowCanExpand: () => true,
      getExpandedRowModel: getExpandedRowModel(),
    }),
    ...(columnVisibility &&
      setColumnVisibility && {
        columnVisibility,
        onColumnVisibilityChange: setColumnVisibility,
      }),
    state: {
      ...(onSortChange && { sorting }),
      ...(columnVisibility && setColumnVisibility && { columnVisibility }),
      ...(rowSelection && { rowSelection: rowSelection.rowSelection }),
    },
    ...(rowSelection &&
      rowSelection.setRowSelection && {
        enableRowSelection: true,
        onRowSelectionChange: rowSelection.setRowSelection,
      }),
    ...(onSortChange && {
      onSortingChange: onSortChange,
      getSortedRowModel: getSortedRowModel(),
      ...(manualSorting && { manualSorting }),
    }),
  });
};
