import React from 'react';
import {
  OsdsIcon,
  OsdsButton,
  OsdsMenuItem,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Guide } from './types';

interface GuidesHeaderItemProps {
  guide: Guide;
  href: string;
  label: string;
  tracking?: string;
  onClick?: (guide: Guide) => void;
}

export function GuidesHeaderItem({
  guide,
  href,
  label,
  onClick,
}: GuidesHeaderItemProps) {
  return (
    <OsdsMenuItem>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        href={href}
        variant={ODS_BUTTON_VARIANT.ghost}
        target={OdsHTMLAnchorElementTarget._blank}
        onClick={() => {
          if (onClick) {
            onClick(guide);
          }
        }}
      >
        <span slot="start">
          {label}
          <OsdsIcon
            className="ml-4"
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      </OsdsButton>
    </OsdsMenuItem>
  );
}
