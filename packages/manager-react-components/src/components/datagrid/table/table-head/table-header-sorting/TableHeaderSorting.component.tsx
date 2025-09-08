import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { flexRender } from '@tanstack/react-table';
import { useDatagridContext } from '../../../useDatagrid.context';
import { TableHeaderSortingProps } from './TableHeaderSorting.props';

export const TableHeaderSorting = <T,>({
  header,
}: TableHeaderSortingProps<T>) => {
  const { onSortChange } = useDatagridContext<T>();
  return (
    <div
      {...{
        className:
          onSortChange && header.column.getCanSort()
            ? 'cursor-pointer select-none'
            : '',
        ...(onSortChange && {
          onClick: header.column.getToggleSortingHandler(),
        }),
      }}
      data-testid={`header-${header.id}`}
    >
      <span>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      <span className={`align-middle inline-block pl-1 -mt-1`}>
        <Icon
          className={header.column.getIsSorted() ? '' : 'invisible'}
          name={
            (header.column.getIsSorted() as string) === 'asc'
              ? ICON_NAME.arrowUp
              : ICON_NAME.arrowDown
          }
        />
      </span>
    </div>
  );
};
