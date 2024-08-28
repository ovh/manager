import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';

export interface DescriptionProps {
  children?: React.ReactNode;
  className?: string;
}
export const Description: React.FC<DescriptionProps> = ({
  children,
  className,
}: DescriptionProps) => {
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

export default Description;
