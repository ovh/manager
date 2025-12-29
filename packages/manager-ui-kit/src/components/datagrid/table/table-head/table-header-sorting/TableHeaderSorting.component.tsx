import { flexRender } from '@tanstack/react-table';

import { ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { TableHeaderSortingProps } from './TableHeaderSorting.props';

export const TableHeaderSorting = <T,>({ header, onSortChange }: TableHeaderSortingProps<T>) => {
  const canSort = header.column.getCanSort();
  const handleClick = onSortChange ? header.column.getToggleSortingHandler() : undefined;
  const containerClassName = `${canSort ? 'cursor-pointer select-none' : ''} h-[20px]  h-auto`;

  return (
    <div
      {...(handleClick && { onClick: handleClick })}
      data-testid={`header-${header.id}`}
      className={containerClassName}
    >
      <span className="whitespace-normal wrap-break-word" style={{ wordBreak: 'break-word' }}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      <span className="align-middle inline-block pl-1 -mt-1">
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
