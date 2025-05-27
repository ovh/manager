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
  /** hides app name from breadcrumb */
  hideRootLabel?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  rootLabel,
  appName,
  hideRootLabel = false,
}) => {
  const breadcrumbItems = useBreadcrumb({
    rootLabel,
    appName,
    hideRootLabel,
  });
  return (
    <OdsBreadcrumb>
      {breadcrumbItems
        ?.filter((item) => !item.hideLabel)
        ?.map((item) => (
          <OdsBreadcrumbItem
            key={item.label}
            href={item.href}
            label={item.label}
          />
        ))}
    </OdsBreadcrumb>
  );
};
