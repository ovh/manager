import { FC, PropsWithChildren } from 'react';
import { Card, Text } from '@ovhcloud/ods-react';

type TDashboardCardLayoutProps = { title: string };

const DashboardCardLayout: FC<PropsWithChildren<TDashboardCardLayoutProps>> = ({
  children,
  title,
}) => (
  <Card color="neutral" className="p-6">
    <Text preset="heading-4">{title}</Text>
    <section>{children}</section>
  </Card>
);

export default DashboardCardLayout;
