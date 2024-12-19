import React, { useContext } from 'react';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { URL_INFO } from './constants';
import { useIs1AZ } from '../../hooks/useIs1AZ/useIs1AZ';

export function RegionLocalzoneChip({
  showTooltip = true,
}: Readonly<{
  showTooltip?: boolean;
}>) {
  const { t } = useTranslation('pci-region-selector');
  const is1AZ = useIs1AZ();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType as keyof typeof URL_INFO][ovhSubsidiary] ||
    URL_INFO[linkType as keyof typeof URL_INFO].DEFAULT;

  const chip = (
    <OsdsChip
      class="chip-LZ"
      size={ODS_CHIP_SIZE.sm}
      onClick={(event) => event.stopPropagation()}
    >
      <OsdsText level={ODS_TEXT_LEVEL.body} size={ODS_TEXT_SIZE._500}>
        {t('pci_project_flavors_zone_localzone')}
      </OsdsText>
      {showTooltip && (
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xs}
          className="ml-2"
        />
      )}
    </OsdsChip>
  );

  if (showTooltip)
    return (
      <OsdsPopover>
        <span slot="popover-trigger">{chip}</span>
        <OsdsPopoverContent>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
          >
            {t(
              `pci_project_flavors_zone_localzone${
                is1AZ ? '_1AZ' : ''
              }_tooltip`,
            )}
          </OsdsText>
          &nbsp;
          <Links
            tab-index="-1"
            label={t('pci_project_flavors_zone_tooltip_link')}
            type={LinkType.external}
            target={OdsHTMLAnchorElementTarget._blank}
            href={getDocumentUrl('LOCAL_ZONE')}
          />
        </OsdsPopoverContent>
      </OsdsPopover>
    );

  return chip;
}
