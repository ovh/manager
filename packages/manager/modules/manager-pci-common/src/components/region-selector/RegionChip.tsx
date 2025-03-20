import { OsdsChip, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  JSX,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { HTMLAttributes } from 'react';

export type RegionChipProps = JSX.OsdsChip &
  HTMLAttributes<HTMLOsdsChipElement> & {
    showTooltipIcon?: boolean;
    title: string;
    className?: string;
  };

export function RegionChip({
  showTooltipIcon,
  title,
  className,
  ...chipProps
}: RegionChipProps) {
  return (
    <OsdsChip class={className} size={ODS_CHIP_SIZE.sm} inline {...chipProps}>
      <OsdsText level={ODS_TEXT_LEVEL.body} size={ODS_TEXT_SIZE._500}>
        {title}
      </OsdsText>
      {showTooltipIcon && (
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xs}
          className="ml-2"
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      )}
    </OsdsChip>
  );
}
