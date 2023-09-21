import React, { ReactNode } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import './Dashboard.scss';

interface SectionProps {
  title: string;
}

const TileCustom: React.FC<React.PropsWithChildren<SectionProps>> = ({
  title,
  children,
}) => (
  <OsdsTile flex>
    <div className="tile-content">
      <OsdsText
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
      <OsdsDivider separator />
      {children}
    </div>
  </OsdsTile>
);

export default TileCustom;
