import { useTranslation } from 'react-i18next';
import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';

import A from '@/components/links/A.component';
import { cn } from '@/lib/utils';

const getBadgeConfig = (type: RegionTypeEnum) => {
  switch (type) {
    case RegionTypeEnum.region:
      return {
        label: '1-AZ',
        className: 'bg-primary-400 text-white',
      };
    case RegionTypeEnum['region-3-az']:
      return {
        label: '3-AZ',
        className: 'bg-primary-500 text-white',
      };
    case RegionTypeEnum.localzone:
      return {
        label: 'LocalZone',
        className: 'bg-primary-300 text-white',
      };
    default:
      return {
        label: '?',
        className: 'bg-neutral-100 text-text',
      };
  }
};

interface RegionTypeBadgeProps {
  type: RegionTypeEnum;
  className?: string;
}

export const RegionTypeBadge = ({ type, className }: RegionTypeBadgeProps) => {
  const config = getBadgeConfig(type);

  return (
    <Badge className={cn(config.className, 'whitespace-nowrap', className)}>
      <span>{config.label}</span>
    </Badge>
  );
};

interface RegionTypeBadgeWithPopoverProps extends RegionTypeBadgeProps {
  showPopover?: boolean;
}

export const RegionTypeBadgeWithPopover = ({
  type,
  className,
  showPopover = true,
}: RegionTypeBadgeWithPopoverProps) => {
  const { t } = useTranslation(['regions', 'pci-object-storage/order-funnel']);

  const helpLink = (
    <A
      href="https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/"
      className="flex gap-1 items-center"
      target="_blank"
      rel="noreferrer noopener"
    >
      {t('help-link-more-info')}
      <ExternalLink className="size-3" />
    </A>
  );

  const getDescription = (regionType: RegionTypeEnum) => {
    switch (regionType) {
      case RegionTypeEnum.region:
        return t('region-description-1AZ');
      case RegionTypeEnum['region-3-az']:
        return t('region-description-3AZ');
      case RegionTypeEnum.localzone:
        return t('region-description-localzone');
      default:
        return '';
    }
  };

  if (!showPopover) {
    return <RegionTypeBadge type={type} className={className} />;
  }

  const config = getBadgeConfig(type);
  const description = getDescription(type);

  return (
    <Badge className={className || config.className}>
      <span>{config.label}</span>
      {description && (
        <Popover>
          <PopoverTrigger asChild>
            <HelpCircle className="size-4 ml-2" />
          </PopoverTrigger>
          <PopoverContent className="text-sm">
            {description}
            {helpLink}
          </PopoverContent>
        </Popover>
      )}
    </Badge>
  );
};
