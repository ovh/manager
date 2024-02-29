import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useBreadcrumb } from '@ovh-ux/manager-react-core-application';

function Breadcrumb(): JSX.Element {
  const breadcrumbItems = useBreadcrumb({
    rootLabel: 'Dashboard',
    appName: 'hub',
  });

  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
