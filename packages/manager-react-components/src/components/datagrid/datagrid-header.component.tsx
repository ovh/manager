import { flexRender } from '@tanstack/react-table';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsIcon } from '@ovhcloud/ods-components/react';
import { useRef, useCallback } from 'react';

const DatagridHeader = ({
  table,
  headerRefs,
  contentAlignLeft,
  onSortChange,
}) => {
  const setHeaderRef = useCallback(
    (el: HTMLElement | null, headerId: string) => {
      if (el) {
        const newRefs = { ...headerRefs.current };
        newRefs[headerId] = el;
        // eslint-disable-next-line no-param-reassign
        headerRefs.current = newRefs;
      }
    },
    [headerRefs],
  );

  console.info('table.getHeaderGroups() : ', table.getHeaderGroups());
  return (
    <thead
      className="sticky z-10 bg-white shadow-sm"
      style={{
        top: '-2px',
      }}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              ref={(el) => setHeaderRef(el, header.id)}
              className={`${
                contentAlignLeft ? 'text-left pl-4' : 'text-center'
              } h-11 whitespace-nowrap bg-white`}
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
