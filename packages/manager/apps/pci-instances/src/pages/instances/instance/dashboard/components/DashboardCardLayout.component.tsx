import { FC, PropsWithChildren } from 'react';
import { Card, Divider, Text } from '@ovhcloud/ods-react';

type TDashboardCardLayoutProps = { title: string };

const DashboardCardLayout: FC<PropsWithChildren<TDashboardCardLayoutProps>> = ({
  children,
  title,
}) => (
  <Card color="neutral" className="p-6">
    <header>
      <Text preset="heading-4">{title}</Text>
      <Divider spacing="6" />
    </header>
    <section>{children}</section>
  </Card>
);

export default DashboardCardLayout;
