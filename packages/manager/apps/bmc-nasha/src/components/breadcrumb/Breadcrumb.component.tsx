import React from 'react';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { AppConfig, appName } from '@/App.constants';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';

function Breadcrumb({ customRootLabel, items }: BreadcrumbProps): JSX.Element {
  const rootLabel = customRootLabel || AppConfig.rootLabel;
  const breadcrumbItems = useBreadcrumb({ rootLabel, appName, items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map((item, index) => (
        <BreadcrumbItem key={`${item.label}-${index}`}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
