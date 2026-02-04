import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Icon, Skeleton, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';

import { urls } from '@/routes/Routes.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { fromIpToId } from '@/utils/ipFormatter';

import './ip-table-block.scss';

type IpTableBlockProps = {
  ip: string;
  serviceName: string;
  ipType: 'ipV4' | 'ipV6';
  rowIdx: number;
  bridgedSubrange: string[];
  opened: boolean;
  hasTask: boolean;
  onIpBlockToggled: (ip: string) => void;
};

export const IpTableBlock = ({
  ip,
  serviceName,
  ipType,
  rowIdx,
  bridgedSubrange,
  opened,
  hasTask,
  onIpBlockToggled,
}: IpTableBlockProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.publicIpRouting);
  const navigate = useNavigate();
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

  const navigateToDetachModal = () =>
    navigate(
      urls.detachIpv4.replace(':serviceName', serviceName).replace(':ip', fromIpToId(ip) ?? ''),
    );

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
        <td>{hasTask ? <Skeleton /> : ip}</td>
        <td className={`text-center`}>
          {ipType === 'ipV4' && !hasTask ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  data-testid={`trash-ip-${ip}`}
                  className="cursor-pointer"
                  name="trash"
                  onClick={navigateToDetachModal}
                />
              </TooltipTrigger>
              <TooltipContent>{t('publicIpRouting_region_detach_ip_tooltip')}</TooltipContent>
            </Tooltip>
          ) : undefined}
        </td>
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
