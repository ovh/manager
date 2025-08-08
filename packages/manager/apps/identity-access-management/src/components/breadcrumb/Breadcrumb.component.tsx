import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumb } from '@/hooks/breadcrumb/useBreadcrumb';
import { SubApp } from '@/identity-access-management.config';

export interface BreadcrumbProps {
  /** root label step */
  rootLabel: string;
  /** application name define in the shell */
  appName: string;
  /** hides app name from breadcrumb */
  hideRootLabel?: boolean;
  /** sub uapp */
  subApp: SubApp;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  rootLabel,
  appName,
  hideRootLabel = false,
  subApp,
}) => {
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumb({
    rootLabel,
    appName,
    hideRootLabel,
    subApp,
  });
  return (
    <OdsBreadcrumb>
      {breadcrumbItems
        ?.filter((item) => !item.hideLabel)
        ?.map((item) => (
          <OdsBreadcrumbItem
            key={item.label}
            href={null}
            label={item.label}
            onClick={() => navigate(item.navigate)}
          />
        ))}
    </OdsBreadcrumb>
  );
};
