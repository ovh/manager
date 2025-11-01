import { Row } from '@tanstack/react-table';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxControl,
  ICON_NAME,
  Icon,
  TABLE_SIZE,
} from '@ovhcloud/ods-react';

import { Button } from '../../button';
import { ExpandedProps } from '../Datagrid.props';

export const getExpandable = <T,>(expandable: ExpandedProps, size: TABLE_SIZE) => ({
  cell: ({ row }: { row: Row<T> }) => {
    const ButtonSize =
      size === TABLE_SIZE.sm
        ? BUTTON_SIZE.xs
        : size === TABLE_SIZE.md
          ? BUTTON_SIZE.sm
          : BUTTON_SIZE.md;
    console.info('ButtonSize : ', ButtonSize);
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
  maxSize: 30,
  minSize: 30,
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
  header: ({ table: tableHeader }) => (
    <Checkbox
      id="select-all"
      name="select-all"
      onChange={() => {
        tableHeader.toggleAllRowsSelected();
      }}
      checked={tableHeader.getIsAllRowsSelected()}
    >
      <CheckboxControl />
    </Checkbox>
  ),
  id: 'select',
  enableResizing: false,
  maxSize: 30,
  minSize: 30,
});
