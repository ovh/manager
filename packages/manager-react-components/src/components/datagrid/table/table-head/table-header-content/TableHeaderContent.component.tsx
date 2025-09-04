import { flexRender } from '@tanstack/react-table';
import { TableHeaderContentProps } from '../TableHeaderContent.props';

export const TableHeaderContent = <T,>({
  headerGroups,
}: TableHeaderContentProps<T>) => {
  return (
    <thead>
      {headerGroups?.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
