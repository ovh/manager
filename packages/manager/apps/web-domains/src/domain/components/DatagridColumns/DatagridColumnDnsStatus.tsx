import React from 'react';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';

interface DatagridColumnBadgeProps {
  readonly status: string;
}

export default function DatagridColumnDnsStatus({
  status,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('domain');

  let badgeColor: BADGE_COLOR;

  switch (status.toUpperCase()) {
    case NameServerStatusEnum.DELETING:
      badgeColor = BADGE_COLOR.warning;
      break;
    case NameServerStatusEnum.ERROR:
      badgeColor = BADGE_COLOR.critical;
      break;
    case NameServerStatusEnum.ENABLED:
      badgeColor = BADGE_COLOR.success;
      break;
    case NameServerStatusEnum.ACTIVATING:
    default:
      badgeColor = BADGE_COLOR.information;
      break;
  }

  return (
    <Badge color={badgeColor} data-testid="status">
      {t(`domain_dns_table_state_${status.toLowerCase()}`)}
    </Badge>
  );
}
