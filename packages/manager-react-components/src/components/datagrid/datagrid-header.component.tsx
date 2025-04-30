import {
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  flexRender,
} from '@tanstack/react-table';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsIcon } from '@ovhcloud/ods-components/react';

const DatagridHeader = ({
  table,
  headerRefs,
  contentAlignLeft,
  onSortChange,
}) => {
  return (
    <thead
      style={{
        display: 'grid',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: '#FFFFFF',
      }}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              ref={(el) => {
                headerRefs.current[header.id] = el;
              }}
              className={`${
                contentAlignLeft ? 'text-left pl-4' : 'text-center'
              } h-11 whitespace-nowrap `}
              style={{
                display: 'flex',
                width: header.getSize(),
              }}
            >
              {header.isPlaceholder ? null : (
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
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </>
                  </span>
                  <span className={`align-middle inline-block h-4 -mt-6`}>
                    <OdsIcon
                      className={header.column.getIsSorted() ? '' : 'invisible'}
                      name={
                        (header.column.getIsSorted() as string) === 'asc'
                          ? ODS_ICON_NAME.arrowUp
                          : ODS_ICON_NAME.arrowDown
                      }
                    />
                  </span>
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default DatagridHeader;
