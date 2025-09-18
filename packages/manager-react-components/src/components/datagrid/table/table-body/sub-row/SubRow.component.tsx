import { memo } from 'react';
import { SubRowProps } from './SubRow.props';

export const SubRow = <T,>({
  row,
  renderSubComponent,
  subComponentHeight,
  virtualRow,
  offset,
  maxRowHeight,
}: SubRowProps<T>) => (
  <tr
    key={`${row.id}-expanded-tr`}
    data-index={`${virtualRow.index}-expanded-tr`}
    className={`overflow-hidden absolute top-0 h-[${subComponentHeight}px] display-table table-layout-fixed`}
    style={{
      left: -1,
      width: '-webkit-fill-available',
      borderRight: '1px solid var(--ods-color-neutral-100)',
      borderLeft: '1px solid var(--ods-color-neutral-100)',
      borderBottom: '1px solid var(--ods-color-neutral-100)',
      transform: `translateY(${virtualRow.start + offset + maxRowHeight}px)`,
    }}
  >
    <div className="overflow-hidden p-[8px] w-full">
      {renderSubComponent(row)}
    </div>
  </tr>
);

export const SubRowMemo = memo(SubRow);
