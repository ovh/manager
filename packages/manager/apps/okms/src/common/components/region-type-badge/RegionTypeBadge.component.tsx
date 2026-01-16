import { useId } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsTooltip } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { LocationType } from '@/common/types/location.type';

type RegionTypeBadgeProps = {
  type: LocationType;
};

const bgColors: Record<LocationType, string> = {
  'LOCAL-ZONE': 'bg-[--ods-color-primary-100]',
  'REGION-1-AZ': 'bg-[--ods-color-primary-400]',
  'REGION-3-AZ': 'bg-[--ods-color-primary-700]',
};

const textColors: Record<LocationType, BadgeProp['color']> = {
  'LOCAL-ZONE': 'information',
  'REGION-1-AZ': 'promotion',
  'REGION-3-AZ': 'promotion',
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
        <Text preset="caption" className="w-56">
          <span>{tooltipLabels[type]}</span>
        </Text>
      </OdsTooltip>
    </div>
  );
};
