import React, { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@ovhcloud/ods-react';
import { FlavorsTableTr } from '@/components/flavorsTable/FlavorsTableTr.component';
import {
  TableColumn,
  TableRow,
} from '@/components/flavorsTable/FlavorsTable.component';

type FlavorsTableBodyProps = {
  rows: TableRow[];
  columns: TableColumn[];
  selectable: boolean;
  selectedRowId?: string | null;
  onClick?: (flavorName: string) => void;
  emptyMessage?: string;
};

export const FlavorsTableBody = memo(
  ({
    rows,
    columns,
    selectable,
    onClick,
    selectedRowId,
    emptyMessage,
  }: FlavorsTableBodyProps) => {
    if (rows.length === 0 && emptyMessage) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="p-4 text-center text-[--ods-color-text-500]"
            >
              <Text>{emptyMessage}</Text>
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {rows.map((row) => {
          const isSelected = selectedRowId === row.id;

          const rowClasses = clsx('group', {
            'group cursor-pointer': selectable,
          });

          const cellClasses = clsx(
            'text-left transition-colors',
            selectable &&
              'bg-white group-hover:border-[--ods-color-primary-600]',
            isSelected && 'border-[--ods-color-primary-600]',
          );

          return (
            <FlavorsTableTr
              key={row.id}
              className={rowClasses}
              {...(onClick &&
                !row.disabled && { onClick: () => onClick(row.id) })}
              disabled={row.disabled}
            >
              {columns.map((col, colIndex) => {
                const cellContent =
                  typeof row[col.key] === 'string' ? (
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
          );
        })}
      </tbody>
    );
  },
);

FlavorsTableBody.displayName = 'FlavorsTableBody';
