import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NotificationPriority } from '@/data/types';

export const PRIORITY_COLOR: Record<NotificationPriority, BADGE_COLOR> = {
  HIGH: BADGE_COLOR.critical,
  MEDIUM: BADGE_COLOR.warning,
  LOW: BADGE_COLOR.information,
};

export default function NotificationPriorityChip({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const { t } = useTranslation('common');
  return (
    <Badge
      color={PRIORITY_COLOR[priority]}
    >
      {t(`priority_${priority.toLowerCase()}`)}
    </Badge>
  );
}
