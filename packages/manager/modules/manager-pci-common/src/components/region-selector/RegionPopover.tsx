import React, { PropsWithChildren, ReactNode, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { Links, LinkType } from '@ovh-ux/manager-react-components';

export function RegionPopover({
  children,
  tooltip,
  tooltipUrl,
}: PropsWithChildren<{ tooltip: ReactNode; tooltipUrl: string }>) {
  const { t } = useTranslation('pci-region-selector');
  const generatedTriggerId = useId();
  const triggerId = useMemo(() => CSS.escape('region-popover-trigger'), [
    generatedTriggerId,
  ]);

  return (
    <span>
      <span id={triggerId}>{children}</span>
      <OdsPopover triggerId={triggerId}>
        <OdsText preset="span">{tooltip}</OdsText>&nbsp;
        <Links
          tab-index="-1"
          label={t('pci_project_flavors_zone_tooltip_link')}
          type={LinkType.external}
          target="_blank"
          href={tooltipUrl}
        />
      </OdsPopover>
    </span>
  );
}
