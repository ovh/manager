import React, { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Row, flexRender } from '@tanstack/react-table';
import { OdsTable } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import DatagridHeader from './datagrid-header.component';

const TableBodyRow = ({
  tableLayoutFixed,
  contentAlignLeft,
  row,
  virtualRow,
  rowVirtualizer,
}) => {
  return (
    <tr
      className="border-solid border-[1px] border-[--ods-color-blue-200]"
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      key={row.id}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            className={clsx(
              contentAlignLeft ? 'text-left pl-4' : 'text-center',
              {
                'w-[2.5rem]': cell.id.indexOf('expander') !== -1,
              },
            )}
            style={{
              width: tableLayoutFixed ? `${cell.column.getSize()}px` : null,
              padding: '8px 4px',
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};

const DatagridVirtualized = ({
  className,
  table,
  contentAlignLeft,
  onSortChange,
  tableLayoutFixed,
}) => {
  const headerRefs = useRef({});
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState('100%');

  const { rows } = table.getRowModel();
  const { length: rowsCount } = rows;
  console.info('************************************************');
  console.info('************************************************');
  console.info('************************************************');
  // console.info('rows.length : ', rows.length);
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rowsCount,
    estimateSize: () => 30,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 20,
  });

  useEffect(() => {
    const calculateHeight = () => {
      if (!tableContainerRef.current) return;

      const { current } = tableContainerRef;
      const container = current;
      const { parentElement } = container;

      if (!parentElement) return;

      // Get the parent element's position relative to viewport
      const parentRect = parentElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate available height (viewport height minus parent's top position)
      const availableHeight = viewportHeight - parentRect.top;

      // Set a minimum height of 200px and maximum of 80vh
      const calculatedHeight = Math.max(
        200,
        Math.min(availableHeight, viewportHeight * 0.8),
      );

      setContainerHeight(`${calculatedHeight - 120}px`);
    };

    // Calculate initial height
    calculateHeight();

    // Add resize listener
    window.addEventListener('resize', calculateHeight);

    // Cleanup
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  console.info('containerHeight : ', containerHeight);
  return (
    <div
      ref={tableContainerRef}
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'auto',
        position: 'relative',
        // height: rows.length > 6 ? '55vh' : '100%',
        height: rowsCount > 6 ? containerHeight : '100%',
      }}
    >
      <div className={`contents px-[1px] ${className || ''}`}>
        <OdsTable className="overflow-x-visible">
          <table
            className="w-full border-collapse"
            style={
              { '--expander-column-width': '2.5rem' } as React.CSSProperties
            }
          >
            <DatagridHeader
              table={table}
              headerRefs={headerRefs}
              contentAlignLeft={contentAlignLeft}
              onSortChange={onSortChange}
            />
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<any>;
                console.info('virtualRow.index : ', virtualRow.index);
                return (
                  <TableBodyRow
                    tableLayoutFixed={tableLayoutFixed}
                    contentAlignLeft={contentAlignLeft}
                    key={row.id}
                    row={row}
                    virtualRow={virtualRow}
                    rowVirtualizer={rowVirtualizer}
                  />
                );
              })}
            </tbody>
          </table>
        </OdsTable>
      </div>
    </div>
  );
};

export default DatagridVirtualized;
