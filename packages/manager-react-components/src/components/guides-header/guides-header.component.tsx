import React from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsMenu,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

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
    <OsdsMenu>
      <OsdsButton
        slot={'menu-title'}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.GUIDES}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.sm}
          className={'mr-2'}
        ></OsdsIcon>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {label}
        </OsdsText>
      </OsdsButton>

      {Object.keys(guides).map((guide) => (
        <GuidesHeaderItem
          key={guide}
          guide={guides[guide]}
          href={guides[guide].url[ovhSubsidiary] || guides[guide].url.DEFAULT}
          label={getGuideLabel(guides[guide])}
          onClick={(g: Guide) => {
            if (onGuideClick) {
              onGuideClick(g);
            }
          }}
        ></GuidesHeaderItem>
      ))}
    </OsdsMenu>
  );
}
