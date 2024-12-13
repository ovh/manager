import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/sap-features-hub.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName: 'sap-features-hub',
  });
  return (
    <OdsBreadcrumb>
      {breadcrumbItems?.map((item) => (
        <OdsBreadcrumbItem
          key={item.label}
          href={item.href}
          label={item.label}
        />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
