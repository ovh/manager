import { FC, PropsWithChildren } from 'react';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { Card, CardHeader, CardContent } from '@datatr-ux/uxlib';

type TDashboardCardLayoutProps = { title: string };

const DashboardCardLayout: FC<PropsWithChildren<TDashboardCardLayoutProps>> = ({
  children,
  title,
}) => (
  <Card>
    <CardHeader>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.primary}
        hue={ODS_THEME_COLOR_HUE._800}
      >
        {title}
      </OsdsText>
      <OsdsDivider separator />
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default DashboardCardLayout;
