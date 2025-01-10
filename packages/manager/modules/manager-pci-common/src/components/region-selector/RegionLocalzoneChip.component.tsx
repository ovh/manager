import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { URL_INFO } from './constants';
import { useIs1AZ } from '../../hooks/useIs1AZ/useIs1AZ';
import { RegionChip } from './RegionChip';
import { RegionPopover } from './RegionPopover';

export function RegionLocalzoneChip({
  showTooltip = true,
}: Readonly<{
  showTooltip?: boolean;
}>) {
  const { t } = useTranslation('pci-region-selector');
  const is1AZ = useIs1AZ();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const tooltipUrl =
    URL_INFO.LOCAL_ZONE[ovhSubsidiary] || URL_INFO.LOCAL_ZONE.DEFAULT;

  const chip = (
    <RegionChip
      title={t('pci_project_flavors_zone_localzone')}
      className="chip-LZ"
      showTooltipIcon={showTooltip}
    />
  );

  return showTooltip ? (
    <RegionPopover
      tooltip={t(
        `pci_project_flavors_zone_localzone${is1AZ ? '_1AZ' : ''}_tooltip`,
      )}
      tooltipUrl={tooltipUrl}
    >
      {chip}
    </RegionPopover>
  ) : (
    chip
  );
}
