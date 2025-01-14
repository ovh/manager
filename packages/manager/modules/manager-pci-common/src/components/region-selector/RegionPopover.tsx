import React, { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

export function RegionPopover({
  children,
  tooltip,
  tooltipUrl,
}: PropsWithChildren<{ tooltip: ReactNode; tooltipUrl: string }>) {
  const { t } = useTranslation('pci-region-selector');

  return (
    <OsdsPopover>
      <span slot="popover-trigger">{children}</span>
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          {tooltip}
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
