import React from 'react';
import { Badge } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';

interface DatagridColumnBadgeProps {
  readonly status: string;
}

export default function DatagridColumnDnsStatus({
  status,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('domain');

  let badgeColor: ODS_BADGE_COLOR;

  switch (status.toUpperCase()) {
    case NameServerStatusEnum.DELETING:
      badgeColor = ODS_BADGE_COLOR.warning;
      break;
    case NameServerStatusEnum.ERROR:
      badgeColor = ODS_BADGE_COLOR.critical;
      break;
    case NameServerStatusEnum.ENABLED:
      badgeColor = ODS_BADGE_COLOR.success;
      break;
    case NameServerStatusEnum.ACTIVATING:
    default:
      badgeColor = ODS_BADGE_COLOR.information;
      break;
  }

  return (
    <Badge color={badgeColor} data-testid="status">
      {t(`domain_dns_table_state_${status.toLowerCase()}`)}
    </Badge>
  );
}
