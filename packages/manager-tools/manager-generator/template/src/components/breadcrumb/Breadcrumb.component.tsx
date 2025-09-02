import React from 'react';

import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { AppConfig } from '@/App.constants';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';

function Breadcrumb({ customRootLabel, items }: BreadcrumbProps): JSX.Element {
  const rootLabel = customRootLabel || AppConfig.rootLabel;
  const breadcrumbItems = useBreadcrumb({ rootLabel, items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, href }) => (
        <OdsBreadcrumbItem key={`${label}-${href}`} label={label} href={href} />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
