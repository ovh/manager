import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useBreadcrumb } from '../../hooks';

export interface BreadcrumbProps {
  /** root label step */
  rootLabel: string;
  /** application name define in the shell */
  appName: string;
}

export function Breadcrumb({
  rootLabel,
  appName,
}: BreadcrumbProps): JSX.Element {
  const label = rootLabel;

  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName,
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
