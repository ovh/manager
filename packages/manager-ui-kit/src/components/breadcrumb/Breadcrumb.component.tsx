import React from 'react';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { useBreadcrumb } from '../../hooks/breadcrumb/useBreadcrumb';
import { BreadcrumbProps } from './Breadcrumb.props';

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  appName,
  hideRootLabel = false,
  rootLabel,
}) => {
  const breadcrumbItems = useBreadcrumb({
    appName,
    hideRootLabel,
    rootLabel,
  });
  return (
    <OdsBreadcrumb>
      {breadcrumbItems
        ?.filter((item) => !item.hideLabel)
        ?.map((item) => (
          <BreadcrumbItem key={item.label}>
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
    </OdsBreadcrumb>
  );
};
