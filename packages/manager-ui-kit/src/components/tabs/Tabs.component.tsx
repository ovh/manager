import { Tabs as OdsTabs } from '@ovhcloud/ods-react';

import { TabsProps } from '@/components/tabs/Tabs.props';

export const Tabs = ({ children, ...others }: TabsProps) => (
  <OdsTabs {...others}>{children}</OdsTabs>
);
