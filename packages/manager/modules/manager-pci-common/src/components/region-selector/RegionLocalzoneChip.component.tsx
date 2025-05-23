import { useTranslation } from 'react-i18next';
import { RegionChip } from './RegionChip';

export function RegionLocalzoneChip() {
  const { t } = useTranslation('pci-region-selector');

  return (
    <RegionChip className="[&::part(badge)]:bg-[--ods-color-primary-100] [&::part(badge)]:text-[--ods-color-primary-700]">
      {t('pci_project_flavors_zone_localzone')}
    </RegionChip>
  );
}
