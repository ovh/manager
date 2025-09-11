import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/vmware-public-vcf-aas.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel, items }: BreadcrumbProps): JSX.Element {
  const rootLabel = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({ rootLabel, items });

  // The key is used to force re-render breadcrumb items when the breadcrumb length changes, to update items states (`collapsed` / `last`)
  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, ...props }, index) => (
        <OdsBreadcrumbItem
          key={`${label}-${index}-${breadcrumbItems.length}`}
          label={label}
          {...props}
        />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
