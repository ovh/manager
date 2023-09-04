import React, { ReactNode } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/text/react/';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react/';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react/';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

import './Dashboard.scss';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const TileCustom: React.FC<SectionProps> = ({ title, children }) => (
  <OsdsTile flex>
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
