import React from 'react';
import { OsdsButton, OsdsIcon, OsdsMenu } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { GuidesHeaderItem } from './guides-header-item.component';
import { Guide } from './types';
import { Subsidiary } from '@ovh-ux/manager-config';

export interface GuidesHeaderProps {
  label: string;
  guides: Record<string, Guide>;
  ovhSubsidiary: Subsidiary;
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
    <OsdsMenu>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        slot={'menu-title'}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
      >
        <span slot="start">
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.BOOK}
          />
        </span>
        {label}
      </OsdsButton>

      <div>
        {Object.entries(guides).map(([key, guide]) => (
          <GuidesHeaderItem
            key={key}
            guide={guide}
            href={guide.url[ovhSubsidiary] ?? guide.url.DEFAULT}
            label={getGuideLabel(guide)}
            onClick={(g: Guide) => {
              onGuideClick?.(g);
            }}
          />
        ))}
      </div>
    </OsdsMenu>
  );
}
