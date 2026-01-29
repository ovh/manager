import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import type { TVpsState } from '@/domain/entities/vps';
import {
  getVpsStateCategory,
  type TVpsStateCategory,
} from '@/domain/services/vpsState.service';

const categoryToColor: Record<TVpsStateCategory, BADGE_COLOR> = {
  success: BADGE_COLOR.success,
  warning: BADGE_COLOR.warning,
  error: BADGE_COLOR.critical,
  info: BADGE_COLOR.information,
};

type TVpsStateBadgeProps = {
  state: TVpsState;
};

export const VpsStateBadge = ({ state }: TVpsStateBadgeProps) => {
  const { t } = useTranslation('vps');
  const category = getVpsStateCategory(state);
  const color = categoryToColor[category];
  const translationKey = `vps_state_${state}`;
  const translatedLabel = t(translationKey);

  return (
    <Badge color={color} className="h-[26px]">
      <div className="flex items-center gap-1">
        <span className="first-letter:uppercase text-nowrap">{translatedLabel}</span>
      </div>
    </Badge>
  );
};
