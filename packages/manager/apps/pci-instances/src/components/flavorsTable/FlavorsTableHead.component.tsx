import React, { memo } from 'react';
import { TableColumn } from '@/components/flavorsTable/FlavorsTable.component';

export const FlavorsTableHead = memo(
  ({ columns }: { columns: TableColumn[] }) => {
    const colHeaderClasses =
      'text-left border-l-0 first:border-l first:border-r-0 [&_*]:text-[--ods-color-heading] *:font-semibold';
    return (
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className={colHeaderClasses}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
    );
  },
);

FlavorsTableHead.displayName = 'FlavorsTableHead';
