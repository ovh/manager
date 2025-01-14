import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { URL_INFO } from './constants';
import { useHas3AZ } from '../../hooks/useHas3AZ/useHas3AZ';
import { useIs1AZ } from '../../hooks/useIs1AZ/useIs1AZ';
import { RegionChip } from './RegionChip';
import { RegionPopover } from './RegionPopover';

export function RegionGlobalzoneChip({
  showTooltip = true,
}: Readonly<{
  showTooltip?: boolean;
}>) {
  const { t } = useTranslation('pci-region-selector');
  const is1AZ = useIs1AZ();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const linkType = is1AZ ? '1AZ_REGIONS' : 'GLOBAL_REGIONS';
  const tooltipUrl =
    URL_INFO[linkType][ovhSubsidiary] || URL_INFO[linkType].DEFAULT;

  const has3AZ = useHas3AZ();

  const chip = (
    <RegionChip
      showTooltipIcon={showTooltip}
      title={t(`pci_project_flavors_zone_${is1AZ ? '1AZ' : 'global_region'}`)}
      className="chip-1AZ"
      onClick={showTooltip ? (event) => event.stopPropagation() : undefined}
    />
  );

  return showTooltip ? (
    <RegionPopover
      tooltipUrl={tooltipUrl}
      tooltip={
        is1AZ && !has3AZ
          ? t('pci_project_flavors_zone_1AZ_with_3AZ_tooltip')
          : t(
              `pci_project_flavors_zone_${
                is1AZ ? '1AZ' : 'globalregions'
              }_tooltip`,
            )
      }
    >
      {chip}
    </RegionPopover>
  ) : (
    chip
  );
}
