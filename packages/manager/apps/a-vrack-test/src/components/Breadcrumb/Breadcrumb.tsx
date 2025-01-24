import React from 'react';
import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/a-vrack-test.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName: 'a-vrack-test',
  });
  return (
    <OdsBreadcrumb>
      {breadcrumbItems?.map(item => (
        <OdsBreadcrumbItem key={item.label} href={item.href} label={item.label} />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
