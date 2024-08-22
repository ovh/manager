import React from 'react';
import {
  OsdsButton,
  OsdsText,
  OsdsIcon,
  OsdsMenuItem,
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
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Guide } from './interface';

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
        variant={ODS_BUTTON_VARIANT.ghost}
        href={href}
        color={ODS_THEME_COLOR_INTENT.primary}
        target={OdsHTMLAnchorElementTarget._blank}
        onClick={() => {
          if (onClick) {
            onClick(guide);
          }
        }}
      >
        <span slot={'start'}>
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {label}
          </OsdsText>
          <OsdsIcon
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
            className={'ml-1'}
          ></OsdsIcon>
        </span>
      </OsdsButton>
    </OsdsMenuItem>
  );
}
