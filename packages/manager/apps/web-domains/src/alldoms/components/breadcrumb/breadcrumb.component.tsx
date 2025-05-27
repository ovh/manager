import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useBreadcrumb } from '@/alldoms/hooks/breadcrumb/useBreadcrumb';

interface BreadcrumbProps {
  /** root label step */
  rootLabel: string;
  /** application name define in the shell */
  appName: string;
  /** paths to ignore in the breadcrumb */
  ignoredLabel?: string[];
}

export default function Breadcrumb({
  rootLabel,
  appName,
  ignoredLabel,
}: BreadcrumbProps) {
  const breadcrumbItems = useBreadcrumb({
    rootLabel,
    appName,
    ignoredLabel,
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
