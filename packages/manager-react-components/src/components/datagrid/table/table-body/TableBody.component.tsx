import { useEffect, useCallback } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { TableBodyProps } from './TableBody.props';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EmptyTableRow } from './empty-table-row/EmptyTableRow.component';
import { LoadingTableRow } from './loading-table-row/LoadingTableRow.component';
import { SubRow } from './sub-row/SubRow.component';
import { usePrevious } from './usePrevious';

const DEFAULT_ROW_HEIGHT = 50;

export const TableBody = <T,>({
  rowModel,
  tableContainerRef,
  isLoading,
  renderSubComponent,
  subComponentHeight = 50,
}: TableBodyProps<T>) => {
  const { rows } = rowModel;
  const previousRowsLength = usePrevious(rows?.length);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: (index) => {
      const row = rowModel?.rows[index];
      return row.getIsExpanded()
        ? subComponentHeight + DEFAULT_ROW_HEIGHT
        : DEFAULT_ROW_HEIGHT;
    },
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10,
  });

  // Empty rows
  if (rows?.length === 0 && !isLoading) {
    return <EmptyTableRow />;
  }

  // Scroll to the first new row
  useEffect(() => {
    if (previousRowsLength !== undefined && rows?.length > previousRowsLength) {
      rowVirtualizer.scrollToIndex(previousRowsLength, { align: 'start' });
    }
  }, [rows?.length]);

  // Helper: how many expanded rows are before this index
  const EXPANDED_SIZE = subComponentHeight - 2;
  const getOffset = useCallback(
    (index: number) => {
      let count = 0;
      for (let i = 0; i < index; i++) {
        if (rows[i].getIsExpanded()) count++;
      }
      return count * EXPANDED_SIZE;
    },
    [rows],
  );

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
        const row = rows[virtualRow.index] as Row<T>;
        const offset = renderSubComponent ? getOffset(virtualRow.index) : 0;
        if (
          index === rowVirtualizer.getVirtualItems().length - 1 &&
          isLoading
        ) {
          return (
            <LoadingTableRow
              isLoading={isLoading}
              pageSize={rows.length}
              virtualRow={virtualRow}
              columns={row.getVisibleCells().map((cell) => cell.column)}
            />
          );
        }
        return (
          <>
            <tr
              data-index={virtualRow.index}
              ref={(node) => rowVirtualizer.measureElement(node)}
              key={row.id}
              className="flex absolute w-full height-[50px]"
              style={{
                transform: `translateY(${virtualRow.start + offset}px)`,
              }}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="overflow-hidden py-[8px] flex items-center flex-1 min-width-0"
                    style={{
                      ...(cell?.column?.columnDef?.maxSize && {
                        maxWidth: cell?.column?.columnDef?.maxSize,
                      }),
                    }}
                  >
                    <>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </>
                  </td>
                );
              })}
            </tr>
            {row.getIsExpanded() && (
              <SubRow
                id={row.id + 'expanded'}
                renderSubComponent={renderSubComponent}
                subComponentHeight={subComponentHeight}
                virtualRow={virtualRow}
                offset={offset}
                row={row}
              />
            )}
          </>
        );
      })}
    </tbody>
  );
};
