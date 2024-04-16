import React from 'react';
import {
  useBreadcrumb,
  BreadcrumbProps,
} from '@ovh-ux/manager-react-shell-client';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';

export const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const breadcrumbItems = useBreadcrumb({
    rootLabel: 'Zimbra',
    appName: 'zimbra',
  });

  return <OsdsBreadcrumb items={breadcrumbItems} />;
};

export default Breadcrumb;
