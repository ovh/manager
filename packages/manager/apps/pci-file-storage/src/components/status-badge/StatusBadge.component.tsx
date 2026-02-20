import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge, type BadgeColor } from '@ovhcloud/ods-react';

type TStatusBadgeColor = 'success' | 'warning' | 'critical' | 'neutral';

const BADGE_COLOR_BY_STATUS: Record<TStatusBadgeColor, BadgeColor> = {
  success: BADGE_COLOR.success,
  warning: BADGE_COLOR.warning,
  critical: BADGE_COLOR.critical,
  neutral: BADGE_COLOR.neutral,
};

export type TStatusBadgeProps = {
  labelKey: string;
  badgeColor: TStatusBadgeColor;
};

export const StatusBadge = ({ labelKey, badgeColor }: TStatusBadgeProps) => {
  const { t } = useTranslation(['status']);

  return (
    <Badge color={BADGE_COLOR_BY_STATUS[badgeColor]} size="md" className="text-nowrap">
      {t(labelKey)}
    </Badge>
  );
};
