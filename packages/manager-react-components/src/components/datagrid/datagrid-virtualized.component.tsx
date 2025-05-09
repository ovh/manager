import React, { useRef } from 'react';
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
      className="border-solid border-[1px] h-[3.25rem] border-[--ods-color-blue-200]"
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

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 100,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 100,
  });

  console.info('rows.length : ', rows.length);
  return (
    <div
      ref={tableContainerRef}
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'auto',
        position: 'relative',
        height: rows.length > 6 ? '55vh' : '100%',
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
