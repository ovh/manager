import React, { ReactNode } from 'react';
import {
  OsdsText,
  OsdsDivider,
  OsdsTile,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';

import './Dashboard.scss';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const TileCustom: React.FC<SectionProps> = ({ title, children }) => (
  <OsdsTile flex>
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

export default TileCustom;
