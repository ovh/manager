import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';

export const CommonTitle: React.FC<
  React.PropsWithChildren & {
    typoSize: ODS_THEME_TYPOGRAPHY_SIZE;
  }
> = ({ children, typoSize }) => {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
      size={typoSize}
      color={ODS_THEME_COLOR_INTENT.text}
      hue={ODS_THEME_COLOR_HUE._800}
    >
      {children}
    </OsdsText>
  );
};

export const Title: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._700}>
      {children}
    </CommonTitle>
  );
};

export const Subtitle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._500}>
      {children}
    </CommonTitle>
  );
};

export default Title;
