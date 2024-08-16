import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/a-nasha.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName: 'a-nasha',
  });
  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
