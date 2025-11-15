import { JSX, memo } from 'react';

import { SubRowProps } from './SubRow.props';

export const SubRow = ({
  maxRowHeight,
  offset,
  renderSubComponent,
  row,
  subComponentHeight,
  virtualRow,
}: SubRowProps) => (
  <tr
    key={`${row.id}-expanded-tr`}
    data-index={`${virtualRow.index}-expanded-tr`}
    className={`overflow-hidden absolute top-0 display-table table-layout-fixed h-full`}
    style={{
      left: -1,
      height: `${subComponentHeight}px`,
      width: '-webkit-fill-available',
      transform: `translateY(${virtualRow.start + offset + maxRowHeight - 1}px)`,
    }}
  >
    <td className="overflow-hidden p-[8px] text-ellipsis block w-full h-full">
      {renderSubComponent(row)}
    </td>
  </tr>
);

export const SubRowMemo = memo(SubRow) as <T>(props: SubRowProps<T>) => JSX.Element;
