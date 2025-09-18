import { flexRender, Row } from '@tanstack/react-table';
import { TableBodyProps } from './TableBody.props';
import { useVirtualizer } from '@tanstack/react-virtual';

export const TableBody = <T,>({
  rowModel,
  tableContainerRef,
}: TableBodyProps<T>) => {
  const { rows } = rowModel;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 40,
  });

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<T>;
        return (
          <tr
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
            key={row.id}
            style={{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
              width: '100%',
            }}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <td
                  key={cell.id}
                  className="overflow-hidden py-[8px]"
                  style={{
                    display: 'flex',
                    flex: 1,
                    minWidth: 0,
                    ...(cell?.column?.columnDef?.maxSize && {
                      maxWidth: cell?.column?.columnDef?.maxSize,
                    }),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
