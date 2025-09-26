import { useEffect, useCallback, Fragment } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TableBodyProps } from './TableBody.props';
import { EmptyTableRow } from './empty-table-row/EmptyTableRow.component';
import { usePrevious } from './usePrevious';
import { SubRowMemo } from './sub-row/SubRow.component';
import { LoadingTableRow } from './loading-table-row/LoadingTableRow.component';

export const TableBody = <T,>({
  rowModel,
  tableContainerRef,
  isLoading,
  renderSubComponent,
  subComponentHeight = 50,
  maxRowHeight,
  pageSize = 10,
  autoScroll = true,
}: TableBodyProps<T>) => {
  const { rows } = rowModel;
  const previousRowsLength = usePrevious(rows?.length);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: useCallback(() => maxRowHeight, [maxRowHeight]),
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (el) => el?.getBoundingClientRect().height
        : undefined,
    overscan: 15,
  });

  if (rows?.length === 0 && !isLoading) {
    return <EmptyTableRow />;
  }

  useEffect(() => {
    if (
      autoScroll &&
      previousRowsLength !== undefined &&
      rows?.length > previousRowsLength
    ) {
      rowVirtualizer.scrollToIndex(previousRowsLength, { align: 'start' });
    }
  }, [rows?.length]);

  const EXPANDED_SIZE = subComponentHeight;
  const getOffset = useCallback(
    (index: number) => {
      let count = 0;
      for (let i = 0; i < index; i += 1) {
        if (rows[i].getIsExpanded()) count += 1;
      }
      return count * EXPANDED_SIZE;
    },
    [rows],
  );

  const totalHeight = rows.reduce((acc, row) => {
    return acc + maxRowHeight + (row.getIsExpanded() ? subComponentHeight : 0);
  }, 0);

  return (
    <tbody
      key={`table-body-${rows.length}`}
      className="w-full relative p-0 overflow-hidden"
      style={{
        height: isLoading
          ? totalHeight + rows.length + (pageSize - 1 * maxRowHeight)
          : totalHeight + rows.length,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow?.index] as Row<T>;
        const offset = renderSubComponent ? getOffset(virtualRow?.index) : 0;

        if (virtualRow?.index === rows.length - 1 && isLoading) {
          const columns = row.getVisibleCells().map((cell) => cell.column);
          return (
            <LoadingTableRow key={`${row.id}-loading`} columns={columns} />
          );
        }

        return (
          <Fragment key={`table-body-tr-${row.id}`}>
            <tr
              key={row.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`overflow-hidden absolute top-0 w-full h-[${maxRowHeight}px] table table-fixed`}
              style={{
                left: -1,
                transform: `translateY(${virtualRow.start + offset}px)`,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-[8px]"
                  style={{
                    width: cell.column.getSize(),
                    minWidth: cell.column.columnDef.minSize ?? 0,
                    maxWidth: cell.column.columnDef.maxSize ?? 'auto',
                    borderTop: 'none',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {row.getIsExpanded() && renderSubComponent && (
              <SubRowMemo
                key={`${row.id}-expanded`}
                row={row}
                virtualRow={virtualRow}
                offset={offset}
                renderSubComponent={renderSubComponent}
                subComponentHeight={subComponentHeight}
                maxRowHeight={maxRowHeight}
              />
            )}
          </Fragment>
        );
      })}
    </tbody>
  );
};
