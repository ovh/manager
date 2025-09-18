import { memo } from 'react';
import { Row } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

export const SubRow = <T,>({
  id,
  row,
  renderSubComponent,
  subComponentHeight,
  virtualRow,
  offset,
}: {
  id: string;
  renderSubComponent: (row: Row<T>) => JSX.Element;
  subComponentHeight: number;
  virtualRow: VirtualItem;
  offset: number;
  row: Row<T>;
}) => (
  <tr
    key={id + 'expanded'}
    className="flex absolute w-full"
    style={{
      position: 'absolute',
      top: 0,
      transform: `translateY(${virtualRow.start + offset + 48}px)`,
      height: subComponentHeight,
    }}
  >
    <td
      className={`overflow-hidden py-[8px] flex items-center flex-1 min-width-0 h-[${subComponentHeight}px]`}
    >
      <div className={`w-full h-[${subComponentHeight}px]`}>
        {renderSubComponent(row)}
      </div>
    </td>
  </tr>
);

export const SubRowMemo = memo(SubRow);
