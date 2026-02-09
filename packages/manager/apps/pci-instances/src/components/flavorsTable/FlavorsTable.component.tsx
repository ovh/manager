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
  title?: string | null;
  subtitle?: string | null;
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
    onRowClick?: (flavorName: string) => void;
    selectedRowId?: string | null;
  };

const stickyFirstColumnClasses = [
  '[&>thead>tr>th:first-child]:sticky [&>thead>tr>th:first-child]:left-0 [&>thead>tr>th:first-child]:z-30 [&>thead>tr>th:first-child]:w-[32px]',
  '[&>tbody>tr>td:first-child]:sticky [&>tbody>tr>td:first-child]:left-0 [&>tbody>tr>td:first-child]:z-20 [&>thead>tr>th:first-child]:w-[32px]',
];

const selectableClasses = [
  '[&>thead>tr>th:first-child]:w-[32px] [&>tbody>tr>td:first-child]:w-[32px]',
  '[&>thead>tr>th:nth-child(2)]:sticky [&>tbody>tr>th[scope=row]]:sticky',
  '[&>thead>tr>th:nth-child(2)]:left-[32px] [&>tbody>tr>th[scope=row]]:left-[32px]',
  '[&>thead>tr>th:nth-child(2)]:z-20 [&>tbody>tr>th[scope=row]]:z-10',
  '[&>tbody>tr>th[scope=row]]:p-0',
];

export const FlavorsTable = memo(
  ({
    caption,
    columns,
    rows,
    className,
    selectedRowId,
    onRowClick: onClick,
    selectable = false,
    size = TABLE_SIZE.md,
    variant = TABLE_VARIANT.default,
  }: TFlavorsTableProps) => {
    const baseClasses = clsx(
      'min-w-full border-separate border-spacing-0 [&>tbody>tr:last-child>td]:border-b [&>tbody>tr:last-child>th]:border-b',
      stickyFirstColumnClasses,
      selectable && selectableClasses,
      className,
    );

    return (
      <div className="max-w-full overflow-x-auto">
        <Table size={size} variant={variant} className={baseClasses}>
          <caption className="sr-only">{caption}</caption>
          <FlavorsTableHead columns={columns} />
          <FlavorsTableBody
            rows={rows}
            columns={columns}
            selectable={selectable}
            onClick={onClick}
            selectedRowId={selectedRowId}
          />
        </Table>
      </div>
    );
  },
);

FlavorsTable.displayName = 'FlavorsTable';
