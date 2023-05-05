import React from 'react';
import {
  OsdsText,
  OsdsDivider,
  OsdsTile,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <OsdsTile className="dashboard-tile" flex>
    <div className="tile-content">
      <OsdsText
        level={OdsThemeTypographyLevel.heading}
        color={OdsThemeColorIntent.text}
      >
        {title}
      </OsdsText>
      <OsdsDivider separator></OsdsDivider>
      {children}
    </div>
  </OsdsTile>
);

export default Section;
