import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/hpc-vmware-managed-vcd.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel, items }: BreadcrumbProps): JSX.Element {
  const rootLabel = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({ rootLabel, items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, ...props }) => (
        <OdsBreadcrumbItem key={label} label={label} {...props} />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
