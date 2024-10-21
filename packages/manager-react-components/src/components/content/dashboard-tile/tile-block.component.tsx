import React from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';

export type TileBlockProps = React.PropsWithChildren<{
  label?: string;
}>;

export const TileBlock: React.FC<TileBlockProps> = ({ label, children }) => (
  <div className="flex flex-col mb-3">
    {label && (
      <OsdsText
        className="mb-2"
        size={ODS_TEXT_SIZE._200}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.primary}
        hue={ODS_THEME_COLOR_HUE._800}
      >
        {label}
      </OsdsText>
    )}
    <OsdsText
      className="mb-2"
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.default}
    >
      {children}
    </OsdsText>
    <OsdsDivider separator />
  </div>
);
