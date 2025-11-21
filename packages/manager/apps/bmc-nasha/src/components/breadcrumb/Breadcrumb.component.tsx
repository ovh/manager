import React from 'react';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { AppConfig, appName } from '@/App.constants';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';

function Breadcrumb({ customRootLabel, items }: BreadcrumbProps): React.ReactElement {
  const rootLabel = customRootLabel || AppConfig.rootLabel;
  const breadcrumbItems = useBreadcrumb({ rootLabel, appName, items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems
        .filter((item) => item.label)
        .map((item) => (
          <BreadcrumbItem key={item.href}>
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
