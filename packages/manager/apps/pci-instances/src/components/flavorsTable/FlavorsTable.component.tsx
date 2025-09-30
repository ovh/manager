import { RadioGroup, Table, TableProp, TABLE_SIZE, TABLE_VARIANT, Text } from '@ovhcloud/ods-react';
import clsx from "clsx";
import { FlavorsTableTr } from "@/components/flavorsTable/FlavorsTableTr.component";
import { MouseEventHandler } from "react";

export type TableColumn = {
  key: string;
  label?: React.ReactNode;
};

export type TableRow = {
  id: string;
  [key: string]: React.ReactNode;
  unavailable?: boolean
};

export type TFlavorsTableProps = TableProp & React.HTMLAttributes<HTMLTableElement> & {
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
  selectable?: boolean;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
};

export const FlavorsTable = ({ caption, columns, rows, className, onClick, selectable= false, size=TABLE_SIZE.md , variant= TABLE_VARIANT.default }: TFlavorsTableProps) => {
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
    className
  );

  const colHeaderClasses = "text-left border-l-0 first:border-l first:border-r-0 [&_*]:text-[--ods-color-heading] *:font-semibold"

  const rowClasses = clsx(
    {
      'group cursor-pointer': selectable,
    }
  );

  const cellClasses = clsx(
    {
      'bg-white group-hover:border-[--ods-color-primary-600] text-left': selectable,
    }
  );

  return (
    <div className="overflow-x-auto max-w-full">
      <RadioGroup>
        <Table size={size} variant={variant} className={baseClasses}>
          <caption className={"sr-only"}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={colHeaderClasses}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <FlavorsTableTr
                key={row.id}
                className={rowClasses}
                onClick={onClick}
                unavailable={row.unavailable}
              >
                {columns.map((col, colIndex) => {
                  const cellContent =
                    typeof row[col.key] === "string" ? (
                      <Text>{row[col.key]}</Text>
                    ) : (
                      row[col.key]
                    );

                  if (colIndex === 1) {
                    return (
                      <th key={col.key} scope="row" className={cellClasses}>
                        {cellContent}
                      </th>
                    );
                  }

                  return (
                    <td key={col.key} className={cellClasses}>
                      {cellContent}
                    </td>
                  );
                })}
              </FlavorsTableTr>
            ))}
          </tbody>
        </Table>
      </RadioGroup>
    </div>
  );
};
