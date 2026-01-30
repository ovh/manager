import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge, type BadgeColor } from '@ovhcloud/ods-react';

import { type TShareStatusBadgeColor } from '@/adapters/shares/left/shareStatusMapper';

const BADGE_COLOR_BY_STATUS: Record<TShareStatusBadgeColor, BadgeColor> = {
  success: BADGE_COLOR.success,
  warning: BADGE_COLOR.warning,
  critical: BADGE_COLOR.critical,
  neutral: BADGE_COLOR.neutral,
};

type TShareStatusBadgeProps = {
  labelKey: string;
  badgeColor: TShareStatusBadgeColor;
};

export const ShareStatusBadge = ({ labelKey, badgeColor }: TShareStatusBadgeProps) => {
  const { t } = useTranslation(['status']);

  return (
    <Badge color={BADGE_COLOR_BY_STATUS[badgeColor]} size="md" className="text-nowrap">
      {t(labelKey)}
    </Badge>
  );
};
