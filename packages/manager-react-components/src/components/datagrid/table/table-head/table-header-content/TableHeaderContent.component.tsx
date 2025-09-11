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
    <thead
      style={{
        display: 'grid',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      {headerGroups?.map((headerGroup) => (
        <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={`${
                contentAlignLeft ? 'text-left pl-4' : 'text-center'
              } h-11 whitespace-nowrap `}
              style={{
                display: 'flex',
                flex: 1, // This will make each header cell take equal width
                minWidth: 0, // Allows flex items to shrink below their content size
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
};

export const TableHeaderContent = memo(TableHeaderContentComponent) as <
  T = unknown,
>(
  props: TableHeaderContentProps<T>,
) => JSX.Element;
