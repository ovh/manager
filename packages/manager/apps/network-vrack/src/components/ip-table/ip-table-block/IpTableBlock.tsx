import { Icon } from '@ovhcloud/ods-react';

import './ip-table-block.scss';

type IpTableBlockProps = {
  ip: string;
  rowIdx: number;
  bridgedSubrange: string[];
  opened: boolean;
  onIpBlockToggled: (ip: string) => void;
};

export const IpTableBlock = ({
  ip,
  rowIdx,
  bridgedSubrange,
  opened,
  onIpBlockToggled,
}: IpTableBlockProps) => {
  const computedIpBlockIconName = opened ? 'chevron-down' : 'chevron-right';

  const computedBlockRowClassName =
    rowIdx % 2 ? 'ip-table-block table-row-stripped' : 'ip-table-block';

  const computedSubRangeRowClassName =
    rowIdx % 2 ? 'ip-table-subrange table-row-stripped' : 'ip-table-subrange';

  const computeUnfoldLineClassName = (subRangeIdx: number) => {
    const isFirstSubRange = subRangeIdx === 0;
    const isLastSubRange = subRangeIdx === bridgedSubrange.length - 1;
    return `with-line ${isFirstSubRange ? 'line-begin' : ''} ${isLastSubRange ? 'line-end' : ''}`;
  };

  return (
    <>
      <tr className={computedBlockRowClassName}>
        <td className={`text-center`}>
          {bridgedSubrange.length ? (
            <Icon
              className="cursor-pointer"
              name={computedIpBlockIconName}
              onClick={() => onIpBlockToggled(ip)}
            />
          ) : (
            ''
          )}
        </td>
        <td>{ip}</td>
        <td></td>
      </tr>
      {opened
        ? bridgedSubrange.map((subRange, subRangeIdx) => (
            <tr key={subRange} className={computedSubRangeRowClassName}>
              <td className={computeUnfoldLineClassName(subRangeIdx)}></td>
              <td className="pl-6">{subRange}</td>
              <td></td>
            </tr>
          ))
        : undefined}
    </>
  );
};
