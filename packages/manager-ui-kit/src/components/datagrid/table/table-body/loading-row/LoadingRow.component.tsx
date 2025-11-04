import { JSX, memo } from 'react';

import { Skeleton } from '@ovhcloud/ods-react';

import { LoadingRowProps } from './LoadingRow.props';

const LoadingRowComponent = <T,>({ columns, pageSize = 10 }: LoadingRowProps<T>) => (
  <>
    {Array.from({ length: pageSize }).map((_, index) => (
      <tr key={`loading-row-${index}`} className="h-[50px]">
        {columns?.map(
          (col, idx) =>
            col.getIsVisible() && (
              <td className="overflow-hidden py-[8px]" key={`loading-cell-${idx}-${col.id}`}>
                <div aria-busy="true" className="w-full">
                  <Skeleton />
                </div>
              </td>
            ),
        )}
      </tr>
    ))}
  </>
);

export const LoadingRow = memo(LoadingRowComponent) as <T>(
  props: LoadingRowProps<T>,
) => JSX.Element | null;
