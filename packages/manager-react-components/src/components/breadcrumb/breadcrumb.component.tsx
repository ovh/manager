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
  /** paths to ignore in the breadcrumb */
  ignoredLabel?: string[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  rootLabel,
  appName,
  ignoredLabel,
}) => {
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
};
