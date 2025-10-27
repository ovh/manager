import type { Row, Table } from '@tanstack/react-table';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxControl,
  ICON_NAME,
  Icon,
} from '@ovhcloud/ods-react';

import { Button } from '@/components/button/Button.component';
import type { ExpandedProps } from '@/components/datagrid/Datagrid.props';

export const getExpandable = <T,>(expandable: ExpandedProps) => ({
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
            <Icon name={row.getIsExpanded() ? ICON_NAME.chevronDown : ICON_NAME.chevronRight} />
          </Button>
        )}
      </div>
    ) : null;
  },
  enableHiding: false,
  enableResizing: true,
  id: 'expander',
  maxSize: 20,
});

export const getRowSelection = <T,>() => ({
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
  enableHiding: true,
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
  id: 'select',
  maxSize: 20,
});
