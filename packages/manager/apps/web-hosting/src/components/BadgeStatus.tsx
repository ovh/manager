import React, { useMemo } from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { Badge } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ResourceStatus,
  ServiceStatus,
  GitStatus,
  DnsStatus,
} from '@/api/type';

export type BadgeStatusProps = {
  itemStatus: string;
  'data-testid'?: string;
  href?: string;
  isLoading?: boolean;
  label?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case GitStatus.CREATED:
    case ResourceStatus.READY:
    case ServiceStatus.ACTIVE:
    case DnsStatus.CONFIGURED:
      return ODS_BADGE_COLOR.success;
    case GitStatus.CREATING:
    case GitStatus.DELETING:
    case GitStatus.DEPLOYING:
    case GitStatus.INITIALERROR:
    case DnsStatus.EXTERNAL:
      return ODS_BADGE_COLOR.warning;
    case GitStatus.DISABLED:
    case GitStatus.ERROR:
    case ResourceStatus.ERROR:
    case ServiceStatus.NONE:
      return ODS_BADGE_COLOR.critical;
    case DnsStatus.NOT_CONFIGURED:
      return ODS_BADGE_COLOR.neutral;
    default:
      return ODS_BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  itemStatus,
  href,
  label,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const statusColor = useMemo(() => getStatusColor(itemStatus), [itemStatus]);
  return (
    <Badge
      onClick={() => {
        window.open(href, '_blank');
      }}
      data-testid={`badge-status-${itemStatus}`}
      color={statusColor}
      label={label || t(`web_hosting_status_${itemStatus.toLowerCase()}`)}
      className="mr-4 cursor-pointer inline-block"
      isLoading={isLoading}
    />
  );
};
