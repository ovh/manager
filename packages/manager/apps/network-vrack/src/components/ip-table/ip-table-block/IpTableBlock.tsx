import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Icon,
  Skeleton,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { SlaacToggler } from '@/components/slaac-toggler/SlaacToggler';
import { useVrackTasksContext } from '@/contexts/vrack-tasks/useVrackTasks';
import { Ipv6BridgedSubrangeDetails } from '@/data/api/get/bridgedSubrange';
import { Ipv6RoutedSubrangeDetails } from '@/data/api/get/routedSubrange';
import { urls } from '@/routes/Routes.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { fromIpToId } from '@/utils/ipFormatter';

import './ip-table-block.scss';

type IpTableBlockProps = {
  ip: string;
  serviceName: string;
  ipType: 'ipV4' | 'ipV6';
  rowIdx: number;
  bridgedSubranges?: Ipv6BridgedSubrangeDetails[];
  routedSubranges?: Ipv6RoutedSubrangeDetails[];
  opened: boolean;
  onIpBlockToggled: (ip: string) => void;
};

export const IpTableBlock = ({
  ip,
  serviceName,
  ipType,
  rowIdx,
  bridgedSubranges,
  routedSubranges,
  opened,
  onIpBlockToggled,
}: IpTableBlockProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.publicIpRouting);
  const { trackedTasks } = useVrackTasksContext();
  const navigate = useNavigate();
  const hasIPTask = trackedTasks.some(({ resourceId }) => resourceId === ip);
  const computedIpBlockIconName = opened ? 'chevron-down' : 'chevron-right';

  const computedBlockRowClassName =
    rowIdx % 2 ? 'ip-table-block table-row-stripped' : 'ip-table-block';

  const computedSubRangeRowClassName =
    rowIdx % 2 ? 'ip-table-subrange table-row-stripped' : 'ip-table-subrange';

  const computeUnfoldLineClassName = (subRangeIdx: number) => {
    const isFirstSubRange = subRangeIdx === 0;
    const totalSubrangeLength = (bridgedSubranges?.length ?? 0) + (routedSubranges?.length ?? 0);
    const isLastSubRange = subRangeIdx === totalSubrangeLength - 1;
    return `with-line ${isFirstSubRange ? 'line-begin' : ''} ${isLastSubRange ? 'line-end' : ''}`;
  };

  const navigateToDetachModal = () =>
    navigate(
      urls.detachIpv4.replace(':serviceName', serviceName).replace(':ip', fromIpToId(ip) ?? ''),
    );

  const navigateToDetachSubrangeModal = (subrange: string) =>
    navigate(
      urls.detachIpv6Subrange
        .replace(':serviceName', serviceName)
        .replace(':ip', fromIpToId(ip) ?? '')
        .replace(':subrange', fromIpToId(subrange) ?? ''),
    );

  const hasRoutedSubrangeTask = (subrange: string) =>
    trackedTasks.some(({ resourceId }) => resourceId === subrange);

  return (
    <>
      <tr className={computedBlockRowClassName}>
        <td className={`text-center`}>
          {bridgedSubranges?.length || routedSubranges?.length ? (
            <Icon
              data-testid={`unfold-ip-${ip}`}
              className="cursor-pointer"
              name={computedIpBlockIconName}
              onClick={() => onIpBlockToggled(ip)}
            />
          ) : (
            ''
          )}
        </td>
        <td>{hasIPTask ? <Skeleton /> : ip}</td>
        <td></td>
        <td className={`text-center`}>
          {ipType === 'ipV4' && !hasIPTask ? (
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
        ? bridgedSubranges?.map((subRange, subRangeIdx) => (
            <tr key={subRange.bridgedSubrange} className={computedSubRangeRowClassName}>
              <td className={computeUnfoldLineClassName(subRangeIdx)}></td>
              <td className="pl-6">{subRange.bridgedSubrange}</td>
              <td>
                {subRangeIdx === 0 && (
                  <SlaacToggler
                    serviceName={serviceName}
                    ipv6={ip}
                    bridgedSubrange={subRange.bridgedSubrange}
                    value={subRange.slaac}
                  />
                )}
              </td>
              <td></td>
            </tr>
          ))
        : undefined}
      {opened
        ? routedSubranges?.map((subRange, subRangeIdx) => (
            <tr key={subRange.routedSubrange} className={computedSubRangeRowClassName}>
              <td
                className={computeUnfoldLineClassName(
                  subRangeIdx + (bridgedSubranges?.length ?? 0),
                )}
              ></td>
              <td className="pl-6">
                {hasRoutedSubrangeTask(subRange.routedSubrange) ? (
                  <Skeleton />
                ) : (
                  <>
                    <div className="mb-2">
                      <Text>{subRange.routedSubrange}</Text>
                    </div>
                    <div>
                      <Text preset={TEXT_PRESET.label}>
                        {t('publicIpRouting_region_attached_ip_nexthop')}{' '}
                      </Text>
                      <Text preset={TEXT_PRESET.caption}>{subRange.nexthop}</Text>
                    </div>
                  </>
                )}
              </td>
              <td></td>
              <td className={`text-center`}>
                {!hasRoutedSubrangeTask(subRange.routedSubrange) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        data-testid={`trash-subrange-${subRange.routedSubrange}`}
                        className="cursor-pointer"
                        name="trash"
                        onClick={() => navigateToDetachSubrangeModal(subRange.routedSubrange)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('publicIpRouting_region_detach_subrange_tooltip')}
                    </TooltipContent>
                  </Tooltip>
                ) : undefined}
              </td>
            </tr>
          ))
        : undefined}
    </>
  );
};
