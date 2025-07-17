import React from 'react';
import {
  Breadcrumb as OdsBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import { BreadcrumbProps } from './Breadcrumb.props';
import { useBreadcrumb } from '../../hooks/breadcrumb/useBreadcrumb';

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
