import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Row, flexRender } from '@tanstack/react-table';
import DatagridHeader from './datagrid-header.component';
import { OdsTable } from '@ovhcloud/ods-components/react';

function TableBodyRow({ row, virtualRow, rowVirtualizer }) {
  console.info('TableBodyRow : ', row);
  console.info('row.getVisibleCells() ; ', row.getVisibleCells());
  return (
    <tr
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
        width: '100%',
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            style={{
              display: 'flex',
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

const DatagridVirtualized = ({ table, contentAlignLeft, onSortChange }) => {
  const headerRefs = useRef({});
  console.info('*******************************');
  // The virtualizer will need a reference to the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => {
            console.info(
              'element?.getBoundingClientRect().height : ',
              element?.getBoundingClientRect().height,
            );
            return element?.getBoundingClientRect().height;
          }
        : undefined,
  });

  console.info(
    'rowVirtualizer.getVirtualItems() 111 ; ',
    rowVirtualizer.getVirtualItems(),
  );
  return (
    <div
      className="container"
      ref={tableContainerRef}
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'auto', //our scrollable table container
        position: 'relative', //needed for sticky header
        height: '300px', //should be a fixed height
      }}
    >
      <OdsTable className="overflow-x-visible">
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: 'grid' }}>
          <DatagridHeader
            table={table}
            headerRefs={headerRefs}
            contentAlignLeft={contentAlignLeft}
            onSortChange={onSortChange}
          />
          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<any>;
              return (
                <TableBodyRow
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
  );
};

export default DatagridVirtualized;
