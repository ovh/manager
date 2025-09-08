import { memo } from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableHeaderContentProps } from '../TableHeaderContent.props';
import { TableHeaderSorting } from '../table-header-sorting/TableHeaderSorting.component';

const TableHeaderContentComponent = <T,>({
  contentAlignLeft = true,
  headerGroups,
  onSortChange,
  headerRefs,
}: TableHeaderContentProps<T>) => {
  return (
    <thead>
      {headerGroups?.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              ref={(el) => {
                if (headerRefs && el) {
                  // eslint-disable-next-line no-param-reassign
                  headerRefs[header?.id ?? ''] = el;
                }
              }}
              className={`${
                contentAlignLeft ? 'text-left pl-4' : 'text-center'
              } h-11 whitespace-nowrap `}
            >
              {!header.isPlaceholder &&
                (onSortChange ? (
                  <TableHeaderSorting
                    header={header}
                    onSortChange={onSortChange}
                  />
                ) : (
                  <>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </>
                ))}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export const TableHeaderContent = memo(TableHeaderContentComponent) as <
  T = unknown,
>(
  props: TableHeaderContentProps<T>,
) => JSX.Element;
