import React, { ReactNode } from 'react';
import {
  OsdsText,
  OsdsDivider,
  OsdsTile,
} from '@ovhcloud/ods-components/react/';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';

import './Dashboard.scss';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const TileCustom: React.FC<SectionProps> = ({ title, children }) => (
  <OsdsTile>
    <div className="tile-content">
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
      <OsdsDivider separator></OsdsDivider>
      {children}
    </div>
  </OsdsTile>
);

export default TileCustom;
