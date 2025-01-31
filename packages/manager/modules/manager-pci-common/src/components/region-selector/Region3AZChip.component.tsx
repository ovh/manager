import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { URL_INFO } from './constants';
import { RegionChip } from './RegionChip';
import { RegionPopover } from './RegionPopover';

export function Region3AZChip({
  showTooltip = true,
}: Readonly<{
  showTooltip?: boolean;
}>) {
  const { t } = useTranslation('pci-region-selector');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const documentURL =
    URL_INFO.REGION_3AZ[ovhSubsidiary] || URL_INFO.REGION_3AZ.DEFAULT;

  const chip = (
    <RegionChip
      className="chip-3AZ"
      title={t('pci_project_flavors_zone_3AZ')}
      showTooltipIcon={showTooltip}
      onClick={showTooltip ? (event) => event.stopPropagation() : undefined}
    />
  );

  return showTooltip ? (
    <RegionPopover
      tooltipUrl={documentURL}
      tooltip={t('pci_project_flavors_zone_3AZ_tooltip')}
    >
      {chip}
    </RegionPopover>
  ) : (
    chip
  );
}
