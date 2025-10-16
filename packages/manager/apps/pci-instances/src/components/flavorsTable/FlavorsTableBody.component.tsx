import React, { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@ovhcloud/ods-react';
import { FlavorsTableTr } from '@/components/flavorsTable/FlavorsTableTr.component';
import {
  TableColumn,
  TableRow,
} from '@/components/flavorsTable/FlavorsTable.component';

export const FlavorsTableBody = memo(
  ({
    rows,
    columns,
    selectable,
    onClick,
  }: {
    rows: TableRow[];
    columns: TableColumn[];
    selectable: boolean;
    onClick?: (flavorName: string) => void;
  }) => {
    const rowClasses = clsx({
      'group cursor-pointer': selectable,
    });
    const cellClasses = clsx({
      'bg-white group-hover:border-[--ods-color-primary-600] text-left': selectable,
    });

    return (
      <tbody>
        {rows.map((row) => (
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
                // TODO : if selectable /!\
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
    );
  },
);

FlavorsTableBody.displayName = 'FlavorsTableBody';
