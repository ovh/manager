import React, { useId } from 'react';
import { OdsBadge, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { LocationType } from '@secret-manager/types/location.type';
import { useTranslation } from 'react-i18next';

type RegionTypeBadgeProps = {
  type: LocationType;
};

const bgColors: Record<LocationType, string> = {
  'LOCAL-ZONE': '[&::part(badge)]:bg-[--ods-color-primary-100]',
  'REGION-1-AZ': '[&::part(badge)]:bg-[--ods-color-primary-400]',
  'REGION-3-AZ': '[&::part(badge)]:bg-[--ods-color-primary-700]',
};

const textColors: Record<LocationType, ODS_BADGE_COLOR> = {
  'LOCAL-ZONE': ODS_BADGE_COLOR.information,
  'REGION-1-AZ': ODS_BADGE_COLOR.promotion,
  'REGION-3-AZ': ODS_BADGE_COLOR.promotion,
};

const badgeLabels: Record<LocationType, string> = {
  'LOCAL-ZONE': 'Local Zone',
  'REGION-1-AZ': '1-AZ',
  'REGION-3-AZ': '3-AZ',
};

export const RegionTypeBadge = ({ type }: RegionTypeBadgeProps) => {
  const tooltipId = useId();
  const { t } = useTranslation('common');

  const tooltipLabels: Record<LocationType, string> = {
    'LOCAL-ZONE': t('region_local_zone_description'),
    'REGION-1-AZ': t('region_1_az_description'),
    'REGION-3-AZ': t('region_3_az_description'),
  };

  return (
    <div className={'relative'}>
      <OdsBadge
        id={tooltipId}
        label={badgeLabels[type]}
        color={textColors[type]}
        className={bgColors[type]}
        icon="circle-info"
        iconAlignment="right"
        size="sm"
      />
      <OdsTooltip triggerId={tooltipId} position="right" withArrow>
        <OdsText preset="caption" className="w-56">
          <span>{tooltipLabels[type]}</span>
        </OdsText>
      </OdsTooltip>
    </div>
  );
};
