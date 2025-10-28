import React, { useId, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { RegionType } from '@/types/infrastructures.type';
import { REGION_BADGE_LABELS } from '@/utils/labels.constants';

import { RegionBadgeTypeProps } from './RegionBadgeType.props';

const bgColors: Record<RegionType, string> = {
  'LOCAL-ZONE': '[&::part(badge)]:bg-[--ods-color-primary-100]',
  'REGION-1-AZ': '[&::part(badge)]:bg-[--ods-color-primary-400]',
  'REGION-3-AZ': '[&::part(badge)]:bg-[--ods-color-primary-700]',
};

const textColors: Record<RegionType, ODS_BADGE_COLOR> = {
  'LOCAL-ZONE': ODS_BADGE_COLOR.information,
  'REGION-1-AZ': ODS_BADGE_COLOR.promotion,
  'REGION-3-AZ': ODS_BADGE_COLOR.promotion,
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
    <>
      <OdsBadge
        id={id}
        label={REGION_BADGE_LABELS[type]}
        color={textColors[type]}
        className={bgColors[type]}
        icon="circle-info"
        iconAlignment="right"
        size="sm"
      />
      <OdsTooltip triggerId={id} position="right" withArrow>
        <OdsText preset="caption" className="w-56">
          <span>{tooltipLabels[type]}</span>
        </OdsText>
      </OdsTooltip>
    </>
  );
};
