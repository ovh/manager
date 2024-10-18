import React from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export type TileBlockProps = {
  label: string;
  testid?: string;
};

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  testid,
  children,
}) => (
  <div data-testid={testid} className="flex flex-col mb-3">
    <OsdsDivider separator />
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
      size={ODS_TEXT_SIZE._100}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {children}
    </OsdsText>
  </div>
);
