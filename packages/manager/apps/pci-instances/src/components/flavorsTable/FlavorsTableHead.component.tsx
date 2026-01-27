import React, { memo } from 'react';
import { TableColumn } from '@/components/flavorsTable/FlavorsTable.component';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';

export const FlavorsTableHead = memo(
  ({ columns }: { columns: TableColumn[] }) => {
    const colHeaderClasses =
      'text-left border-l-0 first:border-l first:border-r-0 [&_*]:text-[--ods-color-heading] *:font-semibold';
    return (
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className={colHeaderClasses}>
              <div className="flex flex-col">
                <Text preset={TEXT_PRESET.span} className="font-medium">
                  {col.title}
                </Text>
                <Text preset={TEXT_PRESET.span}>{col.subtitle}</Text>
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  },
);

FlavorsTableHead.displayName = 'FlavorsTableHead';
