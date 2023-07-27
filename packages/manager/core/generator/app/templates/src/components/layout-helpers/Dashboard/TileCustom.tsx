import React, { ReactNode } from 'react';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-stencil/components/react/';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
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
      <OsdsText level={ODS_TEXT_LEVEL.heading} color={OdsThemeColorIntent.text}>
        {title}
      </OsdsText>
      <OsdsDivider separator></OsdsDivider>
      {children}
    </div>
  </OsdsTile>
);

export default TileCustom;
