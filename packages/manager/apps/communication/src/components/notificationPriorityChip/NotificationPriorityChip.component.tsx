import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NotificationPriority } from '@/data/types';

export const PRIORITY_COLOR: Record<NotificationPriority, ODS_BADGE_COLOR> = {
  HIGH: ODS_BADGE_COLOR.critical,
  MEDIUM: ODS_BADGE_COLOR.warning,
  LOW: ODS_BADGE_COLOR.information,
};

export default function NotificationPriorityChip({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const { t } = useTranslation('common');
  return (
    <OdsBadge
      color={PRIORITY_COLOR[priority]}
      label={t(`priority_${priority.toLowerCase()}`)}
    />
  );
}
