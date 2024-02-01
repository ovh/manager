import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';

const CommonTitle: React.FC<{
  title: string;
  typoSize: ODS_THEME_TYPOGRAPHY_SIZE;
}> = ({ title, typoSize }) => {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
      size={typoSize}
      color={ODS_THEME_COLOR_INTENT.text}
      hue={ODS_THEME_COLOR_HUE._800}
    >
      {title}
    </OsdsText>
  );
};

export const Title: React.FC<{ title: string }> = ({ title }) => {
  return (
    <CommonTitle title={title} typoSize={ODS_THEME_TYPOGRAPHY_SIZE._700} />
  );
};

export const Subtitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <CommonTitle title={title} typoSize={ODS_THEME_TYPOGRAPHY_SIZE._500} />
  );
};

export default Title;
