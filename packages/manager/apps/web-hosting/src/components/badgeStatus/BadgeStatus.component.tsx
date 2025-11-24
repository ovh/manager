import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BADGE_COLOR, Badge } from '@ovh-ux/muk';

import { DnsStatus, GitStatus, ResourceStatus, ServiceStatus } from '@/data/types/status';
import { DATAGRID_LINK, WEBSITE } from '@/utils/tracking.constants';

type Status = GitStatus | ResourceStatus | ServiceStatus | DnsStatus;

export type BadgeStatusProps = {
  itemStatus: Status;
  'data-testid'?: string;
  tracking?: string;
  href?: string;
  isLoading?: boolean;
  label?: string;
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case GitStatus.CREATED:
    case ResourceStatus.READY:
    case ServiceStatus.ACTIVE:
    case DnsStatus.CONFIGURED:
      return BADGE_COLOR.success;
    case GitStatus.CREATING:
    case GitStatus.DELETING:
    case GitStatus.DEPLOYING:
    case DnsStatus.EXTERNAL:
      return BADGE_COLOR.warning;
    case GitStatus.INITIALERROR:
    case GitStatus.ERROR:
    case ResourceStatus.ERROR:
    case ResourceStatus.SUSPENDED:
      return BADGE_COLOR.critical;
    case DnsStatus.NOT_CONFIGURED:
    case GitStatus.DISABLED:
    case ServiceStatus.NONE:
      return BADGE_COLOR.neutral;
    default:
      return BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  itemStatus,
  href,
  tracking,
  label,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const { trackClick } = useOvhTracking();
  const statusColor = useMemo(() => getStatusColor(itemStatus), [itemStatus]);
  return (
    <Badge
      onClick={() => {
        if (tracking) {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [`${DATAGRID_LINK}${tracking}_${WEBSITE}`],
          });
        }
        window.open(href, '_blank');
      }}
      data-testid={`badge-status-${itemStatus}`}
      color={statusColor}
      className="mr-4 cursor-pointer inline-block"
      isLoading={isLoading}
    >
      {label || t(`web_hosting_status_${itemStatus.toLowerCase()}`)}
    </Badge>
  );
};
