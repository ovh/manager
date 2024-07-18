import React from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export type TileBlockProps = {
  label: string;
};

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <div className="flex flex-col mb-3">
    <OsdsText
      className="mb-2"
      size={ODS_TEXT_SIZE._200}
      level={ODS_TEXT_LEVEL.heading}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {label}
    </OsdsText>
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
