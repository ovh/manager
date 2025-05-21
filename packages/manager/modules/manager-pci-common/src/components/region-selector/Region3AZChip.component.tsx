import { useTranslation } from 'react-i18next';
import { RegionChip } from './RegionChip';

export function Region3AZChip() {
  const { t } = useTranslation('pci-region-selector');

  return (
    <RegionChip className="[&::part(badge)]:bg-[--ods-color-primary-700] [&::part(badge)]:text-[--ods-color-primary-000]">
      {t('pci_project_flavors_zone_3AZ')}
    </RegionChip>
  );
}
