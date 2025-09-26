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
} from '@ovhcloud/ods-react';
import { UseDatagridTableProps, ExpandableRow } from './useDatagrid.props';
import { Button } from '../button';

export const useDatagrid = <T extends ExpandableRow<T>>({
  columns,
  data,
  sorting,
  onSortChange,
  manualSorting,
  renderSubComponent,
  expandable,
}: UseDatagridTableProps<T>) => {
  const manuelSortingConfig = onSortChange
    ? {
        getSortedRowModel: getSortedRowModel(),
        manualSorting,
        onSortingChange: onSortChange,
        state: {
          sorting,
        },
      }
    : {};

  return useReactTable({
    columns: [
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
    ...manuelSortingConfig,
    debugTable: true,
  });
};
