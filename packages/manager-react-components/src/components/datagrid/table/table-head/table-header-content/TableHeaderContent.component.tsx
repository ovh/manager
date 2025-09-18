import { memo } from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableHeaderContentProps } from '../TableHeaderContent.props';
import { TableHeaderSorting } from '../table-header-sorting/TableHeaderSorting.component';

const TableHeaderContentComponent = <T,>({
  contentAlignLeft = true,
  headerGroups,
  onSortChange,
}: TableHeaderContentProps<T>) => (
  <thead className={`sticky top-[-1px] z-10 bg-white overflow-hidden`}>
    {headerGroups?.map((headerGroup) => (
      <tr key={headerGroup.id} className="h-[50px]">
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            className={`${
              contentAlignLeft ? 'text-left pl-4' : 'text-center'
            } h-11 whitespace-nowrap `}
            style={{
              width: header.column.getSize(),
              minWidth: header.column.columnDef.minSize ?? 0,
              maxWidth: header.column.columnDef.maxSize ?? 'auto',
            }}
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

export const TableHeaderContent = memo(TableHeaderContentComponent) as <
  T = unknown,
>(
  props: TableHeaderContentProps<T>,
) => JSX.Element;
