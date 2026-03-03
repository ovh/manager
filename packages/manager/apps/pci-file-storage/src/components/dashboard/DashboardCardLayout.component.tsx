import React, { FC, PropsWithChildren } from 'react';

import { Card, Text } from '@ovhcloud/ods-react';

type TDashboardCardLayoutProps = PropsWithChildren<{ title: string }>;

export const DashboardCardLayout: FC<TDashboardCardLayoutProps> = ({ children, title }) => (
  <Card color="neutral" className="p-6">
    <Text preset="heading-4" className="text-[--ods-color-heading]">
      {title}
    </Text>
    <section className="flex flex-col gap-4">{children}</section>
  </Card>
);
