import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useBreadcrumb } from '@/hooks/breadcrumb/useBreadcrumb';
import { appName, productName } from '@/sap-features-hub.config';
import { useApplicationBreadcrumbItems } from '@/hooks/breadcrumb/useApplicationBreadcrumbItems';

export type BreadcrumbProps = {
  customRootLabel?: string;
};

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || productName;
  const applicationBreadcrumbItems = useApplicationBreadcrumbItems();
  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName,
    items: applicationBreadcrumbItems,
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
