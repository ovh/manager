import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { StatusEnum } from '@/domain/enum/Status.enum';

interface DatagridColumnBadgeProps {
  readonly status: string;
}

export default function DatagridColumnStatus({
  status,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('domain');

  let badgeColor: BADGE_COLOR;

  switch (status.toUpperCase()) {
    case StatusEnum.DELETING:
      badgeColor = BADGE_COLOR.warning;
      break;
    case StatusEnum.ERROR:
      badgeColor = BADGE_COLOR.critical;
      break;
    case StatusEnum.ENABLED:
      badgeColor = BADGE_COLOR.success;
      break;
    case StatusEnum.UPDATING:
      badgeColor = BADGE_COLOR.information;
      break;
    case StatusEnum.ACTIVATING:
    default:
      badgeColor = BADGE_COLOR.information;
      break;
  }

  return (
    <Badge color={badgeColor} data-testid="status">
      {t(`domain_table_state_${status.toLowerCase()}`)}
    </Badge>
  );
}
