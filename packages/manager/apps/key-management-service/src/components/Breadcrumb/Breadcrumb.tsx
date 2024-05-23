import React from 'react';
import {
  useBreadcrumb,
  BreadcrumbProps,
} from '@ovh-ux/manager-react-shell-client';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';

function Breadcrumb({ rootLabel }: BreadcrumbProps): JSX.Element {
  const breadcrumbItems = useBreadcrumb({
    rootLabel,
    appName: 'key-management-service',
  });

  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
