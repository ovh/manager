import {
  Table,
  TableProp,
  TABLE_SIZE,
  TABLE_VARIANT,
} from '@ovhcloud/ods-react';
import clsx from 'clsx';
import React, { memo } from 'react';
import { FlavorsTableHead } from '@/components/flavorsTable/FlavorsTableHead.component';
import { FlavorsTableBody } from '@/components/flavorsTable/FlavorsTableBody.component';

export type TableColumn = {
  key: string;
  label?: React.ReactNode;
};

export type TableRow = {
  id: string;
  [key: string]: React.ReactNode;
  disabled?: boolean;
};

export type TFlavorsTableProps = TableProp &
  React.HTMLAttributes<HTMLTableElement> & {
    caption: string;
    columns: TableColumn[];
    rows: TableRow[];
    selectable?: boolean;
    onClick?: React.MouseEventHandler<HTMLTableRowElement>;
  };

export const FlavorsTable = memo(
  ({
    caption,
    columns,
    rows,
    className,
    onClick,
    selectable = false,
    size = TABLE_SIZE.md,
    variant = TABLE_VARIANT.default,
  }: TFlavorsTableProps) => {
    const baseClasses = clsx(
      'min-w-full border-separate border-spacing-0',

      '[&>tbody>tr:last-child>td]:border-b [&>tbody>tr:last-child>th]:border-b',

      '[&>thead>tr>th:first-child]:sticky [&>thead>tr>th:first-child]:left-0 [&>thead>tr>th:first-child]:z-30 [&>thead>tr>th:first-child]:w-[32px]',
      '[&>tbody>tr>td:first-child]:sticky [&>tbody>tr>td:first-child]:left-0 [&>tbody>tr>td:first-child]:z-20 [&>thead>tr>th:first-child]:w-[32px]',

      selectable && [
        '[&>thead>tr>th:first-child]:w-[32px] [&>tbody>tr>td:first-child]:w-[32px]',
        '[&>thead>tr>th:nth-child(2)]:sticky [&>tbody>tr>th[scope=row]]:sticky',
        '[&>thead>tr>th:nth-child(2)]:left-[32px] [&>tbody>tr>th[scope=row]]:left-[32px]',
        '[&>thead>tr>th:nth-child(2)]:z-20 [&>tbody>tr>th[scope=row]]:z-10',
      ],
      className,
    );

    return (
      <div className="overflow-x-auto max-w-full">
        <Table size={size} variant={variant} className={baseClasses}>
          <caption className="sr-only">{caption}</caption>
          <FlavorsTableHead columns={columns} />
          <FlavorsTableBody
            rows={rows}
            columns={columns}
            selectable={selectable}
            onClick={onClick}
          />
        </Table>
      </div>
    );
  },
);

FlavorsTable.displayName = 'FlavorsTable';
