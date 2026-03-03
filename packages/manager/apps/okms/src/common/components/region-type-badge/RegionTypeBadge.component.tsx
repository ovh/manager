import { useTranslation } from 'react-i18next';

import {
  Badge,
  BadgeColor,
  Icon,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { LocationType } from '@/common/types/location.type';

type RegionTypeBadgeProps = {
  type: LocationType;
};

const bgColors: Record<LocationType, string> = {
  'LOCAL-ZONE': 'bg-[--ods-color-primary-100]',
  'REGION-1-AZ': 'bg-[--ods-color-primary-400]',
  'REGION-3-AZ': 'bg-[--ods-color-primary-700]',
};

const textColors: Record<LocationType, BadgeColor> = {
  'LOCAL-ZONE': 'information',
  'REGION-1-AZ': 'primary',
  'REGION-3-AZ': 'primary',
};

const badgeLabels: Record<LocationType, string> = {
  'LOCAL-ZONE': 'Local Zone',
  'REGION-1-AZ': '1-AZ',
  'REGION-3-AZ': '3-AZ',
};

export const RegionTypeBadge = ({ type }: RegionTypeBadgeProps) => {
  const { t } = useTranslation('common');

  const tooltipLabels: Record<LocationType, string> = {
    'LOCAL-ZONE': t('region_local_zone_description'),
    'REGION-1-AZ': t('region_1_az_description'),
    'REGION-3-AZ': t('region_3_az_description'),
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge color={textColors[type]} className={bgColors[type]} size="sm">
          <>
            {badgeLabels[type]}
            <Icon name="circle-info" />
          </>
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="w-56">
        <Text preset="small">
          <span>{tooltipLabels[type]}</span>
        </Text>
      </TooltipContent>
    </Tooltip>
  );
};
