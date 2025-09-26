import { memo } from 'react';
import { Skeleton } from '@ovhcloud/ods-react';
import { LoadingTableRowProps } from './LoadingTableRow.props';

const LoadingTableRowComponent = <T,>({
  pageSize = 10,
  columns,
}: LoadingTableRowProps<T>) => {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <tr key={`loading-row-${index}`} className="h-[50px]">
          {columns.map((col, idx) =>
            col.getIsVisible() ? (
              <td
                className="overflow-hidden py-[8px]"
                key={`loading-cell-${idx}-${col.id}`}
              >
                <div aria-busy="true" className="w-full">
                  <Skeleton />
                </div>
              </td>
            ) : null,
          )}
        </tr>
      ))}
    </>
  );
};

export const LoadingTableRow = memo(LoadingTableRowComponent) as <T>(
  props: LoadingTableRowProps<T>,
) => JSX.Element | null;
