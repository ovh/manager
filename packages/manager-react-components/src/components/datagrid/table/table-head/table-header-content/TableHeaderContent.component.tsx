import { flexRender } from '@tanstack/react-table';
import { TableHeaderContentProps } from '../TableHeaderContent.props';
import { useDatagridContext } from '../../../useDatagrid.context';
import { TableHeaderSorting } from '../table-header-sorting/TableHeaderSorting.component';

export const TableHeaderContent = <T,>({
  headerGroups,
  contentAlignLeft = true,
}: TableHeaderContentProps<T>) => {
  const { headerRefs, onSortChange } = useDatagridContext<T>();
  return (
    <thead>
      {headerGroups?.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              ref={(el) => {
                headerRefs.current[header?.id ?? ''] = el;
              }}
              className={`${
                contentAlignLeft ? 'text-left pl-4' : 'text-center'
              } h-11 whitespace-nowrap `}
            >
              {header.isPlaceholder
                ? null
                : onSortChange && <TableHeaderSorting header={header} />}
              {header.isPlaceholder
                ? null
                : !onSortChange && (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </>
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
