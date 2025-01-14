import React from 'react';
import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { GuidesHeaderItem } from './guides-header-item.component';
import { Guide } from './interface';

export interface GuidesHeaderProps {
  label: string;
  guides: Record<string, Guide>;
  ovhSubsidiary: string;
  getGuideLabel: (guide: Guide) => string;
  onGuideClick?: (guide: Guide) => void;
}

export function GuidesHeader({
  label,
  guides,
  ovhSubsidiary,
  getGuideLabel,
  onGuideClick,
}: GuidesHeaderProps) {
  return (
    <>
      <div id="guides-header-trigger">
        <OdsButton
          slot={'menu-title'}
          variant={ODS_BUTTON_VARIANT.ghost}
          icon={ODS_ICON_NAME.book}
          label={label}
        />
      </div>
      <OdsPopover triggerId="guides-header-trigger">
        {Object.keys(guides).map((guide) => (
          <GuidesHeaderItem
            key={guide}
            guide={guides[guide]}
            href={`${guides[guide].url[ovhSubsidiary]}`}
            label={getGuideLabel(guides[guide])}
            onClick={(g: Guide) => {
              if (onGuideClick) {
                onGuideClick(g);
              }
            }}
          />
        ))}
      </OdsPopover>
    </>
  );
}
