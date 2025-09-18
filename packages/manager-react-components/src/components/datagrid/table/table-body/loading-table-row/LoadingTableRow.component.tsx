import { Skeleton } from '@ovhcloud/ods-react';
import { Column } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

type LoadingTableRowProps<T> = {
  isLoading?: boolean;
  pageSize?: number;
  virtualRow: VirtualItem;
  columns: Column<T>[];
};

export const LoadingTableRow = <T,>({
  isLoading = false,
  pageSize = 10,
  virtualRow,
  columns,
}: LoadingTableRowProps<T>) => {
  let lastVirtualRowStart = virtualRow.start;
  if (isLoading) {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, index) => {
          lastVirtualRowStart =
            index === 0 ? lastVirtualRowStart : lastVirtualRowStart + 50;
          return (
            <tr
              key={`loading-row-${index}`}
              className="flex absolute w-full"
              style={{
                transform: `translateY(${lastVirtualRowStart}px)`,
              }}
            >
              {columns.map((col, idx) =>
                col.getIsVisible() ? (
                  <td
                    className="overflow-hidden py-[8px] flex items-center flex-1 min-width-0"
                    key={`loading-cell-${idx}-${col.id}`}
                    style={{
                      ...(col?.columnDef?.maxSize && {
                        maxWidth: col?.columnDef?.maxSize,
                      }),
                    }}
                  >
                    <div aria-busy="true" className="w-full">
                      <Skeleton />
                    </div>
                  </td>
                ) : null,
              )}
            </tr>
          );
        })}
      </>
    );
  }
  return null;
};
