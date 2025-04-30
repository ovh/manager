import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  BreadcrumbItem,
  useBreadcrumb,
} from '@/hooks/breadcrumb/useBreadcrumb';

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

function Breadcrumb({ items }: Readonly<BreadcrumbProps>): JSX.Element {
  const breadcrumbItems = useBreadcrumb({
    items,
  });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, ...props }) => (
        <OdsBreadcrumbItem key={label} label={label} {...props} />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
