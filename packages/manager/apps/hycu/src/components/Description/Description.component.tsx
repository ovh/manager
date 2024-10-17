import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';

export interface CustomDescriptionProps {
  children?: any;
  className?: string;
}

/**
 * Copy of ODS <Description> component to pass i18n with components, not only strings
 */
export const CustomDescription: React.FC<CustomDescriptionProps> = ({
  children,
  className,
}: CustomDescriptionProps) => {
  return (
    <OsdsText
      className={`block ${className}`}
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
      hue={ODS_THEME_COLOR_HUE._500}
    >
      {children}
    </OsdsText>
  );
};

export default CustomDescription;
