import { Fragment, useCallback, useEffect, useMemo } from 'react';

import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { getBrowserName } from '../../utils/Datagrid.utils';
import { TableBodyProps } from './TableBody.props';
import { EmptyRow } from './empty-row/EmptyRow.component';
import { LoadingRow } from './loading-row/LoadingRow.component';
import { SubRowMemo } from './sub-row/SubRow.component';
import { usePrevious } from './usePrevious';

export const TableBody = <T,>({
  autoScroll = true,
  columns,
  isLoading,
  hideHeader = false,
  maxRowHeight,
  expanded,
  pageSize = 10,
  renderSubComponent,
  rowModel,
  subComponentHeight = 50,
  tableContainerRef,
  contentAlignLeft = true,
}: TableBodyProps<T>) => {
  const { rows } = rowModel;
  const previousRowsLength = usePrevious(rows?.length);
  const browserName = useMemo(() => getBrowserName(), []);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => maxRowHeight,
    getScrollElement: () => tableContainerRef,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (el) => el?.getBoundingClientRect().height
        : undefined,
    overscan: 15,
  });

  useEffect(() => {
    if (autoScroll && previousRowsLength !== undefined && rows?.length > previousRowsLength) {
      rowVirtualizer.scrollToIndex(previousRowsLength, { align: 'start' });
    }
  }, [autoScroll, previousRowsLength, rows?.length, rowVirtualizer]);

  const getOffset = useCallback(
    (index: number) => {
      let count = 0;
      for (let i = 0; i < index; i += 1) {
        if (rows[i]?.getIsExpanded()) count += 1;
      }
      return count * subComponentHeight;
    },
    [rows, subComponentHeight],
  );

  const totalHeight = useMemo(() => {
    const total = rows.reduce((acc, row) => {
      return acc + maxRowHeight + (row.getIsExpanded() ? subComponentHeight : 0);
    }, 0);
    return isLoading ? total + (pageSize - 1) * maxRowHeight : total + rows.length;
  }, [rows, maxRowHeight, subComponentHeight, isLoading, expanded]);

  if (rows?.length === 0 && !isLoading) {
    return <EmptyRow />;
  }

  return (
    <tbody
      key={`table-body-${rows.length}`}
      className="relative p-0 overflow-hidden"
      style={{
        height: totalHeight,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow?.index];
        if (!row) return null;
        const offset = renderSubComponent ? getOffset(virtualRow?.index) : 0;
        const translateY = hideHeader
          ? virtualRow.start + offset - virtualRow?.index + 1
          : virtualRow.start + offset - virtualRow?.index - 1;
        const width = !hideHeader ? '100%' : 'calc(100% - 1px)';
        const leftPosition = !hideHeader ? -1 : 0;
        return (
          <Fragment key={`table-body-tr-${row.id}`}>
            <tr
              key={row.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`table overflow-hidden absolute top-0 table table-fixed`}
              style={{
                left: leftPosition,
                height: `${maxRowHeight}px`,
                transform:
                  browserName === 'Safari' && !hideHeader
                    ? `translateY(${translateY + maxRowHeight}px)`
                    : `translateY(${translateY}px)`,
                width,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`${contentAlignLeft ? 'pl-4' : 'text-center'}`}
                  style={{
                    width: cell.column.getSize(),
                    minWidth: cell.column.columnDef.minSize ?? 0,
                    maxWidth: cell.column.columnDef.maxSize ?? 'auto',
                  }}
                >
                  <div
                    className="overflow-hidden text-ellipsis flex items-center w-full"
                    style={{ lineHeight: 1 }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
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
                maxRowHeight={virtualRow?.size ?? maxRowHeight}
              />
            )}
          </Fragment>
        );
      })}
      {isLoading && <LoadingRow key={`loading-row`} columns={columns} />}
    </tbody>
  );
};
