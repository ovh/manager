import React, { createContext, useContext } from 'react';
import {
  Links,
  LinkType,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
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
import { useHas3AZ } from '../../hooks/useHas3AZ/useHas3AZ';

export const FEATURE_REGION_1AZ = 'public-cloud:region-1AZ';

export function RegionGlobalzoneChip({
  showTooltip = true,
}: Readonly<{
  showTooltip?: boolean;
}>) {
  const { t } = useTranslation('pci-region-selector');
  const { data } = useFeatureAvailability([FEATURE_REGION_1AZ]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const linkType = data?.[FEATURE_REGION_1AZ]
    ? '1AZ_REGIONS'
    : 'GLOBAL_REGIONS';
  const tooltipUrl =
    URL_INFO[linkType][ovhSubsidiary] || URL_INFO[linkType].DEFAULT;

  const has3AZ = useHas3AZ();

  const chip = (
    <OsdsChip
      class="chip-1AZ"
      size={ODS_CHIP_SIZE.sm}
      onClick={(event) => event.stopPropagation()}
    >
      <OsdsText level={ODS_TEXT_LEVEL.body} size={ODS_TEXT_SIZE._500}>
        {t(
          `pci_project_flavors_zone_${
            data?.[FEATURE_REGION_1AZ] ? '1AZ' : 'global_region'
          }`,
        )}
      </OsdsText>
      {showTooltip && (
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xs}
          className="ml-2"
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      )}
    </OsdsChip>
  );

  if (showTooltip) {
    return (
      <OsdsPopover>
        <span slot="popover-trigger">{chip}</span>
        <OsdsPopoverContent>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
          >
            {has3AZ && data?.[FEATURE_REGION_1AZ]
              ? t('pci_project_flavors_zone_1AZ_with_3AZ_tooltip')
              : t(
                  `pci_project_flavors_zone_${
                    data?.[FEATURE_REGION_1AZ] ? '1AZ' : 'globalregions'
                  }_tooltip`,
                )}
          </OsdsText>
          &nbsp;
          <Links
            tab-index="-1"
            label={t('pci_project_flavors_zone_tooltip_link')}
            type={LinkType.external}
            target={OdsHTMLAnchorElementTarget._blank}
            href={tooltipUrl}
          />
        </OsdsPopoverContent>
      </OsdsPopover>
    );
  }

  return chip;
}
