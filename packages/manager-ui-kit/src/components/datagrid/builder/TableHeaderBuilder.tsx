import type { Row, Table } from '@tanstack/react-table';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxControl,
  ICON_NAME,
  Icon,
  TABLE_SIZE,
} from '@ovhcloud/ods-react';

import { Button } from '@/components/button/Button.component';
import type { ExpandedProps } from '@/components/datagrid/Datagrid.props';

const ROW_SIZE = 50;

const SIZE_TO_BUTTON_SIZE: Record<TABLE_SIZE, BUTTON_SIZE> = {
  [TABLE_SIZE.sm]: BUTTON_SIZE.xs,
  [TABLE_SIZE.md]: BUTTON_SIZE.sm,
  [TABLE_SIZE.lg]: BUTTON_SIZE.md,
};

export const getExpandable = <T,>(expandable: ExpandedProps<T>, size: TABLE_SIZE) => ({
  cell: ({ row }: { row: Row<T> }) => {
    const ButtonSize = SIZE_TO_BUTTON_SIZE[size] ?? BUTTON_SIZE.md;
    return row.getCanExpand() ? (
      <div
        style={{
          ...(expandable && { paddingLeft: `${row.depth * 2}rem` }),
        }}
      >
        {expandable && row.depth ? null : (
          <Button
            className="m-0 p-0"
            onClick={row.getToggleExpandedHandler()}
            variant={BUTTON_VARIANT.ghost}
            size={ButtonSize}
          >
            <Icon name={row.getIsExpanded() ? ICON_NAME.chevronDown : ICON_NAME.chevronRight} />
          </Button>
        )}
      </div>
    ) : null;
  },
  enableHiding: false,
  enableResizing: true,
  id: 'expander',
  maxSize: ROW_SIZE,
  minSize: ROW_SIZE,
});

export const getRowSelection = <T,>() => ({
  id: 'row-selection',
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
  enableResizing: true,
  header: ({ table }: { table: Table<T> }) => (
    <Checkbox
      id="select-all"
      name="select-all"
      onChange={() => table.toggleAllRowsSelected()}
      checked={table.getIsAllRowsSelected()}
    >
      <CheckboxControl />
    </Checkbox>
  ),
  maxSize: ROW_SIZE,
  minSize: ROW_SIZE,
  enableHiding: false,
});
