import React, { useId, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  Badge,
  ICON_NAME,
  Icon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovh-ux/muk';

import { RegionType } from '@/types/infrastructures.type';
import { REGION_BADGE_LABELS } from '@/utils/labels.constants';

import { RegionBadgeTypeProps } from './RegionBadgeType.props';

const bgColors: Record<RegionType, string> = {
  'LOCAL-ZONE': 'bg-[--ods-color-primary-100]',
  'REGION-1-AZ': 'bg-[--ods-color-primary-400]',
  'REGION-3-AZ': 'bg-[--ods-color-primary-700]',
};

const textColors: Record<RegionType, BADGE_COLOR> = {
  'LOCAL-ZONE': BADGE_COLOR.information,
  'REGION-1-AZ': BADGE_COLOR.promotion,
  'REGION-3-AZ': BADGE_COLOR.promotion,
};

export const RegionBadgeType = ({ type }: RegionBadgeTypeProps) => {
  const { t } = useTranslation('infrastructure');
  const id = useId();
  const tooltipLabels: Record<RegionType, string> = useMemo(
    () => ({
      'LOCAL-ZONE': t('infrastructure.region.zone.local'),
      'REGION-1-AZ': t('infrastructure.region.zone.1_az'),
      'REGION-3-AZ': t('infrastructure.region.zone.3_az'),
    }),
    [t],
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge id={id} color={textColors[type]} className={bgColors[type]} size="sm">
          {REGION_BADGE_LABELS[type]}
          <Icon name={ICON_NAME.circleInfo} className="ml-1" />
        </Badge>
      </TooltipTrigger>
      <TooltipContent id={`tooltip-${id}`} className="w-56">
        {tooltipLabels[type]}
      </TooltipContent>
    </Tooltip>
  );
};
