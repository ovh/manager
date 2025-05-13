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

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  rootLabel,
  appName,
}) => {
  const breadcrumbItems = useBreadcrumb({
    rootLabel,
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
};
