import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  Row,
} from '@tanstack/react-table';
import {
  Icon,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { UseDatagridTableProps } from './useDatagrid.props';
import { Button } from '../button';

export const useDatagrid = <T,>({
  columns,
  data,
  sorting,
  onSortChange,
  manualSorting,
  renderSubComponent,
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
      ...(renderSubComponent
        ? [
            {
              id: 'expander',
              enableHiding: false,
              maxSize: 50,
              cell: ({ row }: { row: Row<T> }) => {
                return row.getCanExpand() ? (
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
                ) : null;
              },
            },
          ]
        : []),
      ...columns,
    ],
    data,
    getCoreRowModel: getCoreRowModel(),
    ...(renderSubComponent
      ? {
          getRowCanExpand: () => true,
          getExpandedRowModel: getExpandedRowModel(),
        }
      : {}),
    ...manuelSortingConfig,
  });
};
