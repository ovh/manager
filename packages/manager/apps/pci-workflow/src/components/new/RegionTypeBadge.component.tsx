import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge } from '@ovhcloud/ods-react';

import { TRegionType } from '@ovh-ux/manager-pci-common';

interface RegionTypeBadgeProps {
  type: TRegionType;
}

const classNameAndTradKeyByType = new Map<TRegionType, { className: string; tradKey: string }>([
  [
    'region',
    {
      className: 'bg-[var(--ods-color-primary-400)] text-[var(--ods-color-primary-000)]',
      tradKey: 'pci_project_flavors_zone_1AZ',
    },
  ],
  [
    'region-3-az',
    {
      className: 'bg-[var(--ods-color-primary-700)] text-[var(--ods-color-primary-000)]',
      tradKey: 'pci_project_flavors_zone_3AZ',
    },
  ],
  [
    'localzone',
    {
      className: 'bg-[var(--ods-color-primary-100)] text-[var(--ods-color-primary-700)]',
      tradKey: 'pci_project_flavors_zone_global_region',
    },
  ],
]);

export const RegionTypeBadge: FC<RegionTypeBadgeProps> = ({ type }) => {
  const { t } = useTranslation('pci-region-selector');

  const { className, tradKey } = classNameAndTradKeyByType.get(type) ?? {};
  const style = className ? { className } : { color: BADGE_COLOR.neutral };
  const translation = tradKey ? t(tradKey) : type;

  return (
    <Badge {...style} size={BADGE_SIZE.sm}>
      {translation}
    </Badge>
  );
};
